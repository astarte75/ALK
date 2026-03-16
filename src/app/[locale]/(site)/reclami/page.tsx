import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { LegalPageWrapper, LegalPageTitle, LegalPageContent } from '@/styles/legalPage'
import ScrollReveal from '@/components/animations/ScrollReveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'it' ? 'Reclami' : 'Complaints',
  }
}

export default async function ReclamiPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const isIT = locale === 'it'

  if (isIT) {
    return (
      <LegalPageWrapper>
        <ScrollReveal>
          <LegalPageTitle>Reclami</LegalPageTitle>
          <LegalPageContent>
            <p>Le presenti informazioni di sintesi offrono una panoramica della modalità di gestione dei reclami da parte di Alkemia SGR S.p.A.</p>
            <p>L&apos;obiettivo della Società consiste nel risolvere i reclami in modo efficiente, efficace e professionale.</p>

            <h2>Quando presentare un reclamo</h2>
            <p>La formulazione di un Reclamo può avvenire:</p>
            <ul>
              <li>in caso di insoddisfazione riguardo il servizio di gestione collettiva e/o d&apos;investimento prestato da Alkemia SGR S.p.A.;</li>
              <li>a fronte di un comportamento di dipendenti/collaboratori esterni o di un&apos;omissione o di un danno/disagio subito cui segue un&apos;eventuale richiesta risarcitoria;</li>
              <li>per difetti dei sistemi informatici, ivi compresi i siti web e le applicazioni mobili, in termini di accessibilità.</li>
            </ul>

            <h2>Informazioni richieste nel reclamo</h2>
            <p>Il reclamo deve riportare:</p>
            <ul>
              <li>i dati identificativi del reclamante (nome, cognome, codice fiscale, indirizzo) e dell&apos;eventuale soggetto delegato alla presentazione del reclamo (in quest&apos;ultimo caso, il reclamo deve recare in allegato una copia della delega o procura conferita);</li>
              <li>i documenti identificativi del reclamante e dell&apos;eventuale soggetto delegato alla presentazione del reclamo;</li>
              <li>le motivazioni del reclamo medesimo;</li>
              <li>la sottoscrizione del reclamante o del delegato.</li>
            </ul>

            <h2>Come presentare un reclamo alla SGR</h2>
            <p>È possibile inviare un Reclamo tramite:</p>
            <ul>
              <li>per posta o a mano presso Alkemia SGR S.p.A. — Segreteria — Piazza Cavour 4 — 35122 Padova;</li>
              <li>tramite PEC, all&apos;indirizzo <a href="mailto:alkemia@pec.alkemiacapital.it">alkemia@pec.alkemiacapital.it</a> (allegando copia del documento di identità in formato PDF).</li>
            </ul>
            <p>Alkemia SGR risponderà per iscritto sollecitamente e comunque entro 60 giorni.</p>

            <h2>Ricorsi e risoluzione delle controversie</h2>
            <p>Nel caso in cui non si ritenga soddisfatto/a delle risposte fornite dalla SGR o non abbia ricevuto risposta, in base alla vigente normativa ha la possibilità di rivolgersi ai seguenti organismi:</p>

            <h3>Arbitro per le Controversie Finanziarie (ACF)</h3>
            <p>Organismo istituito presso la Consob con delibera n. 19602 del 4 maggio 2016, pubblicata nella Gazzetta Ufficiale della Repubblica Italiana n. 116 del 19 maggio 2016, che si occupa delle controversie fra investitori al dettaglio e intermediari inerenti a servizi e attività d&apos;investimento, in particolare in merito all&apos;osservanza da parte della SGR degli obblighi di diligenza, correttezza, informazione e trasparenza che la normativa pone a loro carico quando prestano il servizio di gestione collettiva del risparmio.</p>
            <p>È possibile rivolgersi all&apos;ACF per controversie che implicano la richiesta di somme di denaro inferiori a cinquecentomila euro e se sugli stessi fatti oggetto di ricorso non siano pendenti altre procedure di risoluzione extragiudiziarie delle controversie o sia stato preventivamente presentato un reclamo all&apos;intermediario che ha risposto in maniera insoddisfacente oppure non ha risposto affatto nei 60 giorni successivi alla presentazione.</p>
            <p>Il diritto di ricorrere all&apos;Arbitro non può formare oggetto di rinuncia da parte dell&apos;investitore ed è sempre esercitabile, anche in presenza di clausole di devoluzione delle controversie ad altri organismi di risoluzione extragiudiziale contenute nei contratti.</p>
            <p>La presentazione del ricorso avviene online, attraverso il sito web dell&apos;ACF (<a href="https://www.acf.consob.it" target="_blank" rel="noopener noreferrer">www.acf.consob.it</a>), a cui la Società ha aderito tramite l&apos;Associazione di categoria Assogestioni; occorre registrarsi sul sito e, ottenute le credenziali, accedere all&apos;area riservata e proporre il ricorso.</p>
            <p>Prima di agire in giudizio, è obbligatorio tentare di raggiungere un accordo spontaneo ed esperire il «tentativo di mediazione» per il tramite del sopracitato ACF. Ai fini dell&apos;espletamento del tentativo di mediazione obbligatoria, è possibile rivolgersi anche ad altri Organismi di mediazione iscritti nell&apos;apposito Registro del Ministero della Giustizia. L&apos;elenco degli organismi di mediazione è disponibile sul sito <a href="https://www.giustizia.it" target="_blank" rel="noopener noreferrer">www.giustizia.it</a>.</p>

            <h3>Online Dispute Resolution — ODR</h3>
            <p>In attuazione del Regolamento UE n. 524/2013 del 21 maggio 2013, è operativa la piattaforma creata dall&apos;Unione Europea per la risoluzione extragiudiziaria delle controversie relative a prodotti o servizi venduti online (<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">Online Dispute Resolution — ODR</a>).</p>
          </LegalPageContent>
        </ScrollReveal>
      </LegalPageWrapper>
    )
  }

  return (
    <LegalPageWrapper>
      <ScrollReveal>
        <LegalPageTitle>Complaints</LegalPageTitle>
        <LegalPageContent>
          <p>This summary provides an overview of how Alkemia SGR S.p.A. handles complaints.</p>
          <p>The Company aims to resolve complaints efficiently, effectively, and professionally.</p>

          <h2>When to file a complaint</h2>
          <p>A complaint may be filed:</p>
          <ul>
            <li>in case of dissatisfaction with the collective and/or investment management service provided by Alkemia SGR S.p.A.;</li>
            <li>due to the conduct of employees/external collaborators, or an omission, or damage/inconvenience suffered, followed by a possible claim for compensation;</li>
            <li>for defects in IT systems, including websites and mobile applications, in terms of accessibility.</li>
          </ul>

          <h2>Required information</h2>
          <p>The complaint must include:</p>
          <ul>
            <li>identification details of the complainant (name, surname, tax code, address) and of any delegated person (in which case, a copy of the delegation or power of attorney must be attached);</li>
            <li>identification documents of the complainant and any delegated person;</li>
            <li>the reasons for the complaint;</li>
            <li>the signature of the complainant or delegate.</li>
          </ul>

          <h2>How to submit a complaint</h2>
          <p>A complaint may be sent:</p>
          <ul>
            <li>by post or in person to Alkemia SGR S.p.A. — Secretariat — Piazza Cavour 4 — 35122 Padova;</li>
            <li>by certified email (PEC) to <a href="mailto:alkemia@pec.alkemiacapital.it">alkemia@pec.alkemiacapital.it</a> (attaching a copy of the identity document in PDF format).</li>
          </ul>
          <p>Alkemia SGR will respond in writing promptly and in any case within 60 days.</p>

          <h2>Appeals and dispute resolution</h2>
          <p>If you are not satisfied with the SGR&apos;s response or have not received a response, you may contact the following bodies under applicable regulations:</p>

          <h3>Financial Disputes Arbitrator (ACF)</h3>
          <p>A body established at Consob by resolution no. 19602 of 4 May 2016, which handles disputes between retail investors and intermediaries relating to investment services and activities.</p>
          <p>You may contact the ACF for disputes involving claims of less than five hundred thousand euros, provided no other out-of-court dispute resolution procedures are pending on the same facts, or a complaint has been previously submitted to the intermediary which responded unsatisfactorily or did not respond at all within 60 days.</p>
          <p>Claims are submitted online through the ACF website (<a href="https://www.acf.consob.it" target="_blank" rel="noopener noreferrer">www.acf.consob.it</a>).</p>

          <h3>Online Dispute Resolution — ODR</h3>
          <p>In implementation of EU Regulation no. 524/2013 of 21 May 2013, the platform created by the European Union for out-of-court resolution of disputes relating to products or services sold online is operational (<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">Online Dispute Resolution — ODR</a>).</p>
        </LegalPageContent>
      </ScrollReveal>
    </LegalPageWrapper>
  )
}
