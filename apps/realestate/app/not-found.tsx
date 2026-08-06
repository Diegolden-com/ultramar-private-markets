import { BrandName } from "@/components/brand-name";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found page-grid">
      <BrandName className="not-found__brand" />
      <p className="eyebrow">Ficha no disponible</p>
      <h1>Esta propiedad no está publicada.</h1>
      <p>La información comercial se muestra únicamente cuando ha sido aprobada para difusión.</p>
      <Link className="button button--primary" href="/">
        Ver la colección <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
