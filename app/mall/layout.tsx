import { RecentSalesPopup } from './components/RecentSalesPopup';

export default function MallLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            {children}
            <RecentSalesPopup />
        </section>
    );
}
