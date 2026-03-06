#!/usr/bin/env python3
"""
ANTIGRAVITY Manual Human Verification CLI
========================================
A command-line tool for manual QA verification.

Usage:
    python human_verify.py                    # Interactive mode
    python human_verify.py --review <id>     # Verify specific review
    python human_verify.py --list            # List pending verifications
    python human_verify.py --approve <id>    # Approve a task
    python human_verify.py --reject <id>     # Reject a task
    python human_verify.py --report          # Generate report
"""

import os
import sys
import json
import argparse
import hashlib
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass, field, asdict
from enum import Enum


class VerificationStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_REVIEW = "needs_review"


class TaskType(Enum):
    REVIEW_MATCH = "review_match"
    IMAGE_VALIDATION = "image_validation"
    SPEC_CHECK = "spec_check"
    DEEP_RESEARCH = "deep_research"


@dataclass
class VerificationTask:
    """Manual verification task"""
    task_id: str
    task_type: str
    product_id: str
    product_title: str
    review_text: str = ""
    image_url: str = ""
    ai_score: float = 0.0
    ai_result: str = ""
    status: str = "pending"
    verifier_notes: str = ""
    verified_by: str = ""
    verified_at: str = ""
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())


class AntigravityHumanVerifier:
    """
    Manual human verification system
    Allows QA lead to perform human-level validation
    """
    
    def __init__(self, workspace_path: str = None):
        self.workspace_path = workspace_path or "./docs/antigravity"
        self.tasks_file = os.path.join(self.workspace_path, "verification_tasks.json")
        self.tasks: List[VerificationTask] = []
        self._load_tasks()
        
    def _load_tasks(self):
        """Load tasks from file"""
        if os.path.exists(self.tasks_file):
            with open(self.tasks_file, 'r') as f:
                data = json.load(f)
                self.tasks = [VerificationTask(**t) for t in data]
                
    def _save_tasks(self):
        """Save tasks to file"""
        os.makedirs(self.workspace_path, exist_ok=True)
        with open(self.tasks_file, 'w') as f:
            json.dump([asdict(t) for t in self.tasks], f, indent=2)
    
    def create_task(self, task_type: str, product_id: str, product_title: str,
                   review_text: str = "", image_url: str = "", 
                   ai_score: float = 0.0, ai_result: str = "") -> str:
        """Create new verification task"""
        task_id = f"HV-{len(self.tasks) + 1:05d}"
        
        task = VerificationTask(
            task_id=task_id,
            task_type=task_type,
            product_id=product_id,
            product_title=product_title,
            review_text=review_text,
            image_url=image_url,
            ai_score=ai_score,
            ai_result=ai_result,
            status="pending"
        )
        
        self.tasks.append(task)
        self._save_tasks()
        
        return task_id
    
    def approve_task(self, task_id: str, notes: str = "", verifier: str = "opencode") -> bool:
        """Approve a task"""
        for task in self.tasks:
            if task.task_id == task_id:
                task.status = "approved"
                task.verifier_notes = notes
                task.verified_by = verifier
                task.verified_at = datetime.now().isoformat()
                self._save_tasks()
                return True
        return False
    
    def reject_task(self, task_id: str, reason: str, verifier: str = "opencode") -> bool:
        """Reject a task"""
        for task in self.tasks:
            if task.task_id == task_id:
                task.status = "rejected"
                task.verifier_notes = reason
                task.verified_by = verifier
                task.verified_at = datetime.now().isoformat()
                self._save_tasks()
                return True
        return False
    
    def get_pending_tasks(self) -> List[VerificationTask]:
        """Get all pending tasks"""
        return [t for t in self.tasks if t.status == "pending"]
    
    def get_task(self, task_id: str) -> Optional[VerificationTask]:
        """Get specific task"""
        for task in self.tasks:
            if task.task_id == task_id:
                return task
        return None
    
    def generate_report(self) -> Dict:
        """Generate verification report"""
        total = len(self.tasks)
        approved = len([t for t in self.tasks if t.status == "approved"])
        rejected = len([t for t in self.tasks if t.status == "rejected"])
        pending = len([t for t in self.tasks if t.status == "pending"])
        
        return {
            "total_tasks": total,
            "approved": approved,
            "rejected": rejected,
            "pending": pending,
            "approval_rate": f"{(approved/total*100):.1f}%" if total > 0 else "N/A",
            "generated_at": datetime.now().isoformat()
        }
    
    def display_task(self, task: VerificationTask):
        """Display task details in human-readable format"""
        print(f"\n{'='*60}")
        print(f"TASK ID: {task.task_id}")
        print(f"{'='*60}")
        print(f"Type: {task.task_type}")
        print(f"Product ID: {task.product_id}")
        print(f"Product Title: {task.product_title}")
        
        if task.review_text:
            print(f"\nReview Text:")
            print(f"  {task.review_text[:200]}...")
        
        if task.ai_score > 0:
            print(f"\nAI Analysis:")
            print(f"  Score: {task.ai_score}%")
            print(f"  Result: {task.ai_result}")
        
        print(f"\nStatus: {task.status.upper()}")
        if task.verified_by:
            print(f"Verified By: {task.verified_by}")
            print(f"Verified At: {task.verified_at}")
            print(f"Notes: {task.verifier_notes}")
    
    def interactive_verify(self):
        """Run interactive verification mode"""
        pending = self.get_pending_tasks()
        
        if not pending:
            print("\nNo pending verification tasks!")
            return
        
        print(f"\n{len(pending)} pending tasks found.")
        
        for i, task in enumerate(pending, 1):
            print(f"\n[{i}] {task.task_id}: {task.product_title[:50]}...")
        
        choice = input("\nEnter task number to verify (or 'q' to quit): ")
        
        if choice.lower() == 'q':
            return
        
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(pending):
                task = pending[idx]
                self.display_task(task)
                
                print("\n[A]pprove or [R]eject? ", end="")
                action = input().lower()
                
                if action == 'a':
                    notes = input("Notes (optional): ")
                    self.approve_task(task.task_id, notes)
                    print(f"Task {task.task_id} APPROVED!")
                elif action == 'r':
                    reason = input("Reason for rejection: ")
                    self.reject_task(task.task_id, reason)
                    print(f"Task {task.task_id} REJECTED!")
        except (ValueError, IndexError):
            print("Invalid choice!")


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(description="Antigravity Human Verification CLI")
    parser.add_argument('--list', '-l', action='store_true', help='List pending tasks')
    parser.add_argument('--view', '-v', type=str, help='View specific task')
    parser.add_argument('--approve', '-a', type=str, help='Approve task')
    parser.add_argument('--reject', '-r', type=str, help='Reject task')
    parser.add_argument('--report', action='store_true', help='Generate report')
    parser.add_argument('--interactive', '-i', action='store_true', help='Interactive mode')
    parser.add_argument('--add-test', type=str, nargs=3, metavar=('TITLE', 'REVIEW', 'SCORE'), 
                       help='Add test task')
    
    args = parser.parse_args()
    
    verifier = AntigravityHumanVerifier()
    
    if args.add_test:
        title, review, score = args.add_test
        task_id = verifier.create_task(
            task_type="review_match",
            product_id="PRD-TEST",
            product_title=title,
            review_text=review,
            ai_score=float(score),
            ai_result="auto"
        )
        print(f"Created task: {task_id}")
        return
    
    if args.list:
        pending = verifier.get_pending_tasks()
        print(f"\n{len(pending)} pending tasks:")
        for task in pending:
            print(f"  [{task.task_id}] {task.product_title[:50]}... (AI: {task.ai_score}%)")
        return
    
    if args.view:
        task = verifier.get_task(args.view)
        if task:
            verifier.display_task(task)
        else:
            print(f"Task {args.view} not found!")
        return
    
    if args.approve:
        success = verifier.approve_task(args.approve)
        print(f"Approved: {success}")
        return
    
    if args.reject:
        reason = input("Reason: ")
        success = verifier.reject_task(args.reject, reason)
        print(f"Rejected: {success}")
        return
    
    if args.report:
        report = verifier.generate_report()
        print("\n" + "="*50)
        print("VERIFICATION REPORT")
        print("="*50)
        for key, value in report.items():
            print(f"  {key}: {value}")
        return
    
    if args.interactive:
        verifier.interactive_verify()
        return
    
    # Default: show help
    parser.print_help()
    print("\n\nExamples:")
    print("  python human_verify.py --list                    # List pending tasks")
    print("  python human_verify.py --interactive            # Interactive mode")
    print("  python human_verify.py --add-test 'Title' 'Review' 85  # Add test task")
    print("  python human_verify.py --approve HV-00001       # Approve task")
    print("  python human_verify.py --report                 # Generate report")


if __name__ == "__main__":
    main()
