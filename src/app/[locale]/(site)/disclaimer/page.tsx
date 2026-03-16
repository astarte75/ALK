import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { LegalPageWrapper, LegalPageTitle, LegalPageContent } from '@/styles/legalPage'
import ScrollReveal from '@/components/animations/ScrollReveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'it' ? 'Disclaimer' : 'Disclaimer',
  }
}

export default async function DisclaimerPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const isIT = locale === 'it'

  if (isIT) {
    return (
      <LegalPageWrapper>
        <ScrollReveal>
          <LegalPageTitle>Disclaimer</LegalPageTitle>
          <LegalPageContent>
            <p>Si prega di leggere attentamente le seguenti informazioni prima di accedere al presente sito web. Esse contengono avvisi legali e regolamentari relativi alle informazioni contenute in questo sito.</p>

            <h2>Informazioni generali</h2>
            <p>Il presente sito web è destinato esclusivamente agli Investitori Professionali italiani ai sensi della normativa vigente. Il sito non deve essere utilizzato come base per decisioni di investimento. Alkemia SGR S.p.A. non fornisce consulenza in materia di investimenti attraverso il presente sito.</p>

            <h2>Limitazioni di responsabilità</h2>
            <p>Nei limiti massimi consentiti dalla legge, Alkemia SGR S.p.A. non assume alcuna responsabilità per perdite o danni che possano derivare dall&apos;accesso, dall&apos;utilizzo o dall&apos;affidamento sui contenuti o sulle informazioni presenti in questo sito web.</p>
            <p>Le performance passate non sono indicative dei risultati futuri e non possono essere considerate come garanzia di rendimento. Il valore delle quote può diminuire così come aumentare e non è garantito. Le fluttuazioni dei tassi di cambio possono influire sul valore delle quote e gli investitori potrebbero non recuperare l&apos;importo originariamente investito.</p>

            <h2>Proprietà intellettuale</h2>
            <p>La riproduzione dei contenuti del presente sito è vietata salvo per uso privato. Tutti i diritti di proprietà intellettuale restano di titolarità di Alkemia SGR S.p.A. È consentito il download della documentazione esclusivamente per uso personale e non commerciale.</p>

            <h2>Documentazione</h2>
            <p>Gli investitori potenziali riceveranno i prospetti informativi, i KIID e i contratti di sottoscrizione. Si consiglia di consultare i propri consulenti fiscali, legali e contabili prima di effettuare qualsiasi investimento.</p>

            <h2>Link esterni</h2>
            <p>Alkemia SGR S.p.A. non è responsabile dei contenuti o della funzionalità di siti web di terze parti collegati al presente sito.</p>

            <h2>Cookie e protezione dei dati</h2>
            <p>Il sito utilizza cookie per l&apos;amministrazione del sistema e per analisi statistiche volte a migliorare l&apos;esperienza dell&apos;utente e la personalizzazione dei contenuti. L&apos;utente può rifiutare i cookie attraverso le impostazioni del browser, sebbene ciò possa limitare le funzionalità del sito.</p>

            <h2>Restrizioni</h2>
            <p>L&apos;accesso al presente sito è riservato a soggetti non statunitensi. Le informazioni contenute nel sito non devono essere copiate o ridistribuite senza autorizzazione.</p>

            <h2>Contatti</h2>
            <p>
              <strong>Alkemia SGR S.p.A.</strong><br />
              Sede Legale: Piazza Cavour 4, 35122 Padova<br />
              Direzione Generale: Piazzetta Pattari 7, 20122 Milano<br />
              Tel. +39 049 7354172<br />
              Email: <a href="mailto:segreteria@alkemiacapital.com">segreteria@alkemiacapital.com</a><br />
              Iscritta al n. 99 dell&apos;Albo delle Società di Gestione del Risparmio
            </p>
          </LegalPageContent>
        </ScrollReveal>
      </LegalPageWrapper>
    )
  }

  return (
    <LegalPageWrapper>
      <ScrollReveal>
        <LegalPageTitle>Disclaimer</LegalPageTitle>
        <LegalPageContent>
          <p>Please carefully read the following information before accessing this website. It contains legal and regulatory notices relevant to the information contained herein.</p>

          <h2>General Information</h2>
          <p>This website is intended exclusively for Italian Professional Investors under applicable regulations. The site should not be used as a basis for investment decisions. Alkemia SGR S.p.A. does not provide investment advice through this website.</p>

          <h2>Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Alkemia SGR S.p.A. accepts no liability for any loss or damage which may arise from the access to, use of, or reliance on the content of or information contained on this website.</p>
          <p>Past performance is not a guide to future performance and may not be repeated. The value of shares can go down as well as up and is not guaranteed. Exchange rate fluctuations may affect share value and investors may not recover the amount originally invested.</p>

          <h2>Intellectual Property</h2>
          <p>Reproduction of the contents of this site is prohibited except for private use. All intellectual property rights remain with Alkemia SGR S.p.A. Documentation may only be downloaded for personal, non-commercial use.</p>

          <h2>Documentation</h2>
          <p>Prospective investors will receive prospectuses, KIID documents, and subscription agreements. Tax, legal, and accounting consultation is recommended before making any investment.</p>

          <h2>External Links</h2>
          <p>Alkemia SGR S.p.A. is not responsible for the content or functionality of any third-party websites linked from this site.</p>

          <h2>Cookies and Data Protection</h2>
          <p>This site uses cookies for system administration and statistical analysis to improve user experience and content personalisation. Users may refuse cookies through browser settings, although this may limit site functionality.</p>

          <h2>Restrictions</h2>
          <p>Access to this website is reserved for non-US persons. Information contained on this site must not be copied or redistributed without authorisation.</p>

          <h2>Contact</h2>
          <p>
            <strong>Alkemia SGR S.p.A.</strong><br />
            Registered Office: Piazza Cavour 4, 35122 Padova<br />
            General Management: Piazzetta Pattari 7, 20122 Milano<br />
            Phone: +39 049 7354172<br />
            Email: <a href="mailto:segreteria@alkemiacapital.com">segreteria@alkemiacapital.com</a><br />
            Registered under no. 99 in the Register of Asset Management Companies
          </p>
        </LegalPageContent>
      </ScrollReveal>
    </LegalPageWrapper>
  )
}
