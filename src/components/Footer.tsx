import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <div className="wrap">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <p className="footer-logo">
                            Trekking <span>Arunachal Pradesh</span>
                        </p>
                        <p style={{ maxWidth: 300 }}>
                            A boutique trekking company running fixed-departure
                            and custom treks exclusively inside Arunachal
                            Pradesh since 2013.
                        </p>
                    </div>
                    <nav aria-label="Explore">
                        <h4>Explore</h4>
                        <Link href="/treks">All Treks</Link>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                    </nav>
                    <nav aria-label="Regions" className="footer-regions">
                        <h4>Regions</h4>
                        <Link href="/treks?region=tawang">Tawang District</Link>
                        <Link href="/treks?region=anjaw">Anjaw District</Link>
                        <Link href="/treks?region=lohit">Lohit Valley</Link>
                        <Link href="/treks?region=lower-subansiri">Lower Subansiri</Link>
                        <Link href="/treks?region=upper-subansiri">Upper Subansiri</Link>
                        <Link href="/treks?region=west-kameng">West Kameng</Link>
                        <Link href="/treks?region=dibang-valley">Dibang Valley</Link>
                        <Link href="/treks?region=changlang">Changlang</Link>
                        <Link href="/treks?region=west-siang">West Siang</Link>
                    </nav>
                    <div>
                        <h4>Get in Touch</h4>
                        <p>Itanagar, Arunachal Pradesh, India</p>
                        <p>hello@trekking-arunachal.com</p>
                        <p>Mon&ndash;Sat, 9:00&ndash;18:00 IST</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>
                        &copy; 2026 Trekking Arunachal Pradesh. Sample site &mdash; not a real
                        business.
                    </span>
                    <span>Design by Contour Studio</span>
                </div>
            </div>
        </footer>
    );
}