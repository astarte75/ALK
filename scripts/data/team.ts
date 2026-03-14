/**
 * Team member data for Contentful migration.
 * 15 members extracted from alkemiacapital-site.md with IT + EN content.
 */

export interface TeamMemberData {
  name: { 'it-IT': string; 'en-US': string }
  slug: string
  role: { 'it-IT': string; 'en-US': string }
  category: string
  bio?: { 'it-IT': string; 'en-US': string }
  photoUrl: string
  linkedIn: string
  isBoard: boolean
  sortOrder: number
}

export const teamMembers: TeamMemberData[] = [
  {
    name: { 'it-IT': 'Luca Maurizio Duranti', 'en-US': 'Luca Maurizio Duranti' },
    slug: 'luca-maurizio-duranti',
    role: {
      'it-IT': 'Managing Partner e Amministratore Delegato',
      'en-US': 'Managing Partner & Chief Executive Officer',
    },
    category: 'Partners',
    bio: {
      'it-IT': 'Luca Maurizio Duranti e fondatore, CEO e Managing Partner di Alkemia SGR. Con oltre 20 anni di esperienza nei settori del private equity e della finanza aziendale, guida la strategia e lo sviluppo della societa, con una visione orientata alla crescita sostenibile e alla creazione di valore per investitori e aziende partecipate.',
      'en-US': 'Luca Maurizio Duranti is the founder, CEO and Managing Partner of Alkemia SGR. With over 20 years of experience in private equity and corporate finance, he leads the company\'s strategy and development, with a vision focused on sustainable growth and value creation for investors and portfolio companies.',
    },
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/1.png',
    linkedIn: 'https://www.linkedin.com/in/luca-maurizio-duranti-a76200a4',
    isBoard: true,
    sortOrder: 1,
  },
  {
    name: { 'it-IT': 'Simone Cremonini', 'en-US': 'Simone Cremonini' },
    slug: 'simone-cremonini',
    role: {
      'it-IT': 'Managing Partner e Consigliere Esecutivo',
      'en-US': 'Managing Partner & Executive Director',
    },
    category: 'Partners',
    bio: {
      'it-IT': 'Simone Cremonini e Managing Partner e Consigliere Esecutivo di Alkemia SGR. Promotore e gestore del fondo Sinergia Venture Fund, porta oltre 20 anni di esperienza nei settori Telco, Media e Technology. E entrato nel capitale di Alkemia nel 2024 con l\'obiettivo di incrementare l\'efficienza operativa e la presenza nel venture capital.',
      'en-US': 'Simone Cremonini is Managing Partner and Executive Director of Alkemia SGR. Promoter and manager of the Sinergia Venture Fund, he brings over 20 years of experience in the Telco, Media, and Technology sectors. He joined Alkemia\'s capital in 2024 with the goal of increasing operational efficiency and venture capital presence.',
    },
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/7.png',
    linkedIn: 'https://www.linkedin.com/in/cremonini/',
    isBoard: true,
    sortOrder: 2,
  },
  {
    name: { 'it-IT': 'Giacomo Picchetto', 'en-US': 'Giacomo Picchetto' },
    slug: 'giacomo-picchetto',
    role: {
      'it-IT': 'Managing Partner e Consigliere Esecutivo',
      'en-US': 'Managing Partner & Executive Director',
    },
    category: 'Partners',
    bio: {
      'it-IT': 'Giacomo Picchetto e Managing Partner e Consigliere Esecutivo di Alkemia SGR. Con una lunga carriera negli hedge fund, ha portato la sua competenza nel mondo del private markets. La sua esperienza, arricchita dalla gestione del fondo Sinergia Venture Fund, e preziosa per cogliere le evoluzioni dei settori di investimento e l\'impatto dei cambiamenti macroeconomici.',
      'en-US': 'Giacomo Picchetto is Managing Partner and Executive Director of Alkemia SGR. With a long career in hedge funds, he has brought his expertise to the private markets world. His experience, enriched by managing the Sinergia Venture Fund, is valuable for understanding investment sector evolutions and the impact of macroeconomic changes.',
    },
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/8.png',
    linkedIn: 'https://www.linkedin.com/in/giacomo-picchetto-535205',
    isBoard: true,
    sortOrder: 3,
  },
  {
    name: { 'it-IT': 'Walter Gaiani', 'en-US': 'Walter Gaiani' },
    slug: 'walter-gaiani',
    role: {
      'it-IT': 'Partner',
      'en-US': 'Partner',
    },
    category: 'Partners',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2024/10/HD1A3042-683x1024.jpg',
    linkedIn: '',
    isBoard: false,
    sortOrder: 4,
  },
  {
    name: { 'it-IT': 'Robert Segatto', 'en-US': 'Robert Segatto' },
    slug: 'robert-segatto',
    role: {
      'it-IT': 'CFO e Consigliere',
      'en-US': 'CFO & Director',
    },
    category: 'Partners',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/6.png',
    linkedIn: '',
    isBoard: true,
    sortOrder: 5,
  },
  {
    name: { 'it-IT': 'Domenico Massaro', 'en-US': 'Domenico Massaro' },
    slug: 'domenico-massaro',
    role: {
      'it-IT': 'Partner',
      'en-US': 'Partner',
    },
    category: 'Partners',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/2.png',
    linkedIn: '',
    isBoard: false,
    sortOrder: 6,
  },
  {
    name: { 'it-IT': 'Giorgio Giustino Ventura', 'en-US': 'Giorgio Giustino Ventura' },
    slug: 'giorgio-ventura',
    role: {
      'it-IT': 'Partner',
      'en-US': 'Partner',
    },
    category: 'Partners',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/9.png',
    linkedIn: '',
    isBoard: true,
    sortOrder: 7,
  },
  {
    name: { 'it-IT': 'Riccardo Lanfranchi', 'en-US': 'Riccardo Lanfranchi' },
    slug: 'riccardo-lanfranchi',
    role: {
      'it-IT': 'Investment Director',
      'en-US': 'Investment Director',
    },
    category: 'Investment Team',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/12.png',
    linkedIn: '',
    isBoard: false,
    sortOrder: 8,
  },
  {
    name: { 'it-IT': 'Yuliya Onishchuk', 'en-US': 'Yuliya Onishchuk' },
    slug: 'yuliya-onishchuk',
    role: {
      'it-IT': 'Investment Director',
      'en-US': 'Investment Director',
    },
    category: 'Investment Team',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/3.png',
    linkedIn: '',
    isBoard: false,
    sortOrder: 9,
  },
  {
    name: { 'it-IT': 'Pietro Bologna', 'en-US': 'Pietro Bologna' },
    slug: 'pietro-bologna',
    role: {
      'it-IT': 'Investment Associate',
      'en-US': 'Investment Associate',
    },
    category: 'Investment Team',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/11.png',
    linkedIn: '',
    isBoard: false,
    sortOrder: 10,
  },
  {
    name: { 'it-IT': 'Giovanni Pollio', 'en-US': 'Giovanni Pollio' },
    slug: 'giovanni-pollio',
    role: {
      'it-IT': 'Investment Analyst',
      'en-US': 'Investment Analyst',
    },
    category: 'Investment Team',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/10.png',
    linkedIn: '',
    isBoard: false,
    sortOrder: 11,
  },
  {
    name: { 'it-IT': 'Stefano Gargiolli', 'en-US': 'Stefano Gargiolli' },
    slug: 'stefano-gargiolli',
    role: {
      'it-IT': 'Business Development',
      'en-US': 'Business Development',
    },
    category: 'Operations',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/0X4A0282bn-683x1024.jpg',
    linkedIn: '',
    isBoard: false,
    sortOrder: 12,
  },
  {
    name: { 'it-IT': 'Paola Gatto', 'en-US': 'Paola Gatto' },
    slug: 'paola-gatto',
    role: {
      'it-IT': 'Amministrazione Fondi',
      'en-US': 'Fund Administration',
    },
    category: 'Operations',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/4.png',
    linkedIn: '',
    isBoard: false,
    sortOrder: 13,
  },
  {
    name: { 'it-IT': 'Alexandra Pascariu', 'en-US': 'Alexandra Pascariu' },
    slug: 'alexandra-pascariu',
    role: {
      'it-IT': 'Office Manager',
      'en-US': 'Office Manager',
    },
    category: 'Operations',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/5.png',
    linkedIn: '',
    isBoard: false,
    sortOrder: 14,
  },
  {
    name: { 'it-IT': 'Monica Simonato', 'en-US': 'Monica Simonato' },
    slug: 'monica-simonato',
    role: {
      'it-IT': 'Segreteria e Amministrazione',
      'en-US': 'Secretarial & Administration',
    },
    category: 'Operations',
    photoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/13.png',
    linkedIn: '',
    isBoard: false,
    sortOrder: 15,
  },
]
