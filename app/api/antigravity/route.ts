import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, product_id, product_name, product_data } = body;

    if (action === 'research') {
      return await runEcommerceResearch(product_name);
    }

    if (action === 'verify') {
      return await runVerification(product_id, product_name, product_data);
    }

    if (action === 'check_status') {
      return await checkVerificationStatus(product_id);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Antigravity API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function runEcommerceResearch(productName: string): Promise<NextResponse> {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'docs', 'antigravity', 'human_verification.py');

    const childProc = spawn('python', [
      scriptPath,
      '--research',
      productName
    ], {
      cwd: path.join(process.cwd(), 'docs', 'antigravity'),
      shell: true
    });

    let output = '';
    let errorOutput = '';

    childProc.stdout.on('data', (data: any) => {
      output += data.toString();
    });

    childProc.stderr.on('data', (data: any) => {
      errorOutput += data.toString();
    });

    childProc.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(NextResponse.json({
          success: true,
          output,
          message: 'Research completed'
        }));
      } else {
        resolve(NextResponse.json({
          success: false,
          error: errorOutput
        }, { status: 500 }));
      }
    });
  });
}

async function runVerification(productId: string, productTitle: string, productData: any): Promise<NextResponse> {
  const verificationsFile = path.join(process.cwd(), 'docs', 'antigravity', 'product_verifications.json');

  try {
    let verifications: any[] = [];
    try {
      const content = await fs.readFile(verificationsFile, 'utf-8');
      verifications = JSON.parse(content);
    } catch (e) {
      verifications = [];
    }

    const newVerification = {
      product_id: productId,
      product_title: productTitle,
      product_data: productData,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    verifications.push(newVerification);
    await fs.writeFile(verificationsFile, JSON.stringify(verifications, null, 2));

    return NextResponse.json({
      success: true,
      verification: newVerification,
      message: 'Verification session created'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create verification'
    }, { status: 500 });
  }
}

async function checkVerificationStatus(productId: string): Promise<NextResponse> {
  const verificationsFile = path.join(process.cwd(), 'docs', 'antigravity', 'product_verifications.json');

  try {
    const content = await fs.readFile(verificationsFile, 'utf-8');
    const verifications = JSON.parse(content);

    const verification = verifications.find((v: any) => v.product_id === productId);

    if (verification) {
      return NextResponse.json({
        success: true,
        verification
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Verification not found'
    }, { status: 404 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check status'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Antigravity Verification API',
    version: '1.1.0',
    endpoints: {
      POST: {
        research: 'Run e-commerce research on a product',
        verify: 'Create verification session',
        check_status: 'Check verification status'
      }
    }
  });
}
