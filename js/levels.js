/* ============================================================
   טיול במזרח — נתוני השלבים
   כל שלב מגדיר: יעד, תפאורה, מספר מטוסים, הפקדים שהשחקן מקבל,
   ערכי הפתיחה, המאפיינים הקבועים והפתרון הנכון.
   ============================================================ */

/* אפשרויות הבחירה לכל מאפיין Flexbox */
const OPTIONS = {
  'display': ['block', 'flex'],
  'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
  'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  'align-items': ['flex-start', 'center', 'flex-end'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
  'align-content': ['flex-start', 'center', 'flex-end', 'space-between', 'space-around']
};

/* איך כל פקד מוצג: בורר נפתח (select) או כפתורים (segmented) */
const CONTROL_KIND = {
  'display': 'segmented',
  'flex-wrap': 'segmented',
  'flex-direction': 'select',
  'justify-content': 'select',
  'align-items': 'select',
  'align-content': 'select'
};

/* תיאור קצר לכל מאפיין, מוצג ליד הפקד */
const PROP_NOTE = {
  'display': 'מפעיל את מנגנון ה‑Flexbox על הלוח',
  'flex-direction': 'קובע את כיוון הציר הראשי',
  'justify-content': 'פריסה לאורך הציר הראשי',
  'align-items': 'יישור לאורך הציר המשני',
  'flex-wrap': 'האם מותר לפריטים לרדת לשורה נוספת',
  'align-content': 'פריסת השורות עצמן (פועל רק עם wrap)'
};

/* ---------- תפאורות: SVG בגודל הלוח, 480×400 ---------- */
const SCENES = {

  japan: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-jp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#27395F"/>
        <stop offset=".5" stop-color="#B4657A"/>
        <stop offset="1" stop-color="#F0C39A"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-jp)"/>
    <circle cx="330" cy="168" r="66" fill="#D8452F" opacity=".88"/>
    <path d="M0 400V312c46-6 78-22 104-46 24 24 58 38 104 44v90z" fill="#1A2742" opacity=".3"/>
    <path d="M78 400 208 214l32 38 26-30 128 178z" fill="#16233D"/>
    <path d="M180 262 208 214l30 36-24 12-18-14z" fill="#EDE6D6"/>
    <g fill="#101B2F" opacity=".9">
      <rect x="384" y="300" width="12" height="100"/>
      <rect x="452" y="300" width="12" height="100"/>
      <rect x="370" y="286" width="108" height="11" rx="3"/>
      <rect x="378" y="312" width="92" height="8" rx="2"/>
    </g>
    <g fill="#EDE6D6" opacity=".22">
      <rect x="20" y="112" width="120" height="7" rx="3"/>
      <rect x="44" y="132" width="82" height="7" rx="3"/>
    </g>
  </svg>`,

  vietnam: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-vn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#BEE0DD"/>
        <stop offset=".62" stop-color="#79B3B4"/>
        <stop offset="1" stop-color="#2E6E72"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-vn)"/>
    <circle cx="96" cy="86" r="34" fill="#F5E9C8" opacity=".7"/>
    <g fill="#2C5A5E" opacity=".45">
      <path d="M18 300c26-92 58-108 82-18 10 38 2 58-16 62l-70 2z"/>
      <path d="M402 296c22-86 54-96 66-16 6 42 0 58-16 62l-56 2z"/>
    </g>
    <g fill="#1D4247">
      <path d="M120 306c30-120 66-130 92-28 12 46 2 68-18 72l-78 4z"/>
      <path d="M244 312c24-88 58-96 78-18 10 36 0 56-16 58l-66 2z"/>
      <path d="M328 316c18-64 42-70 56-14 8 28 0 40-12 42l-48 2z"/>
    </g>
    <rect y="316" width="480" height="84" fill="#123438"/>
    <g fill="#173C41" opacity=".7">
      <rect x="0" y="334" width="480" height="4"/>
      <rect x="0" y="356" width="480" height="4"/>
      <rect x="0" y="378" width="480" height="4"/>
    </g>
    <g transform="translate(56 296)">
      <path d="M0 44h92l-12 18H12z" fill="#0D262A"/>
      <path d="M42 44V0l34 44z" fill="#D9A441"/>
      <path d="M40 44V6L12 44z" fill="#C88E36"/>
    </g>
  </svg>`,

  laos: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-la" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5B3F74"/>
        <stop offset=".45" stop-color="#D4714F"/>
        <stop offset="1" stop-color="#F2B658"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-la)"/>
    <circle cx="148" cy="196" r="44" fill="#FBE3A8" opacity=".85"/>
    <path d="M0 250c70-46 130-40 190-6 54 30 116 34 180-10l110-30v46H0z" fill="#7A3F55" opacity=".55"/>
    <path d="M0 286c80-30 150-18 214 8 58 24 130 16 200-30l66-24v46H0z" fill="#4E2A46" opacity=".8"/>
    <rect y="300" width="480" height="100" fill="#3A2140"/>
    <g fill="#F2B658" opacity=".28">
      <rect x="30" y="330" width="140" height="5" rx="2"/>
      <rect x="210" y="348" width="190" height="5" rx="2"/>
      <rect x="90" y="370" width="150" height="5" rx="2"/>
    </g>
    <g fill="#2A1830" transform="translate(316 168)">
      <path d="M56 0 96 40H16z"/>
      <path d="M46 34 106 78H-4z"/>
      <path d="M36 70 116 126H-24z"/>
      <rect x="14" y="120" width="76" height="14"/>
      <rect x="52" y="-22" width="6" height="26"/>
    </g>
  </svg>`,

  thailand: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-th" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8FD3E8"/>
        <stop offset=".58" stop-color="#DFF1EE"/>
        <stop offset=".6" stop-color="#31A9AE"/>
        <stop offset="1" stop-color="#0F6E7E"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-th)"/>
    <circle cx="398" cy="72" r="30" fill="#FCEFC0"/>
    <g fill="#1E5F63">
      <path d="M300 240c8-70 30-82 46-30 8 26 22 30 34 30z" opacity=".65"/>
      <path d="M60 238c10-84 40-96 60-32 10 32 26 32 40 32z"/>
      <path d="M356 238c8-58 28-66 42-22 6 22 16 22 26 22z" opacity=".8"/>
    </g>
    <rect y="238" width="480" height="162" fill="#1D8E9B"/>
    <g fill="#2FA6B0" opacity=".8">
      <rect x="0" y="262" width="480" height="6"/>
      <rect x="0" y="296" width="480" height="6"/>
      <rect x="0" y="334" width="480" height="6"/>
      <rect x="0" y="374" width="480" height="6"/>
    </g>
    <g transform="translate(120 296)">
      <path d="M0 26h130l-16 22H16z" fill="#0C3F49"/>
      <rect x="58" y="-30" width="5" height="56" fill="#0C3F49"/>
      <path d="M63 -28l34 20-34 12z" fill="#E2603F"/>
      <path d="M22 26 12 4h22z" fill="#E2B23F"/>
    </g>
    <g fill="#124B52">
      <rect x="428" y="188" width="7" height="52"/>
      <path d="M431 190c-20-14-34-12-42 2 16-6 28-4 42 4zM431 190c20-14 34-12 42 2-16-6-28-4-42 4zM431 186c-6-20 0-32 16-36-10 12-12 22-16 36zM431 186c6-18 18-24 34-18-14 2-24 8-34 18z"/>
    </g>
  </svg>`,

  cambodia: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-kh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3B2E63"/>
        <stop offset=".5" stop-color="#9B5A6E"/>
        <stop offset="1" stop-color="#EFA765"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-kh)"/>
    <circle cx="240" cy="214" r="52" fill="#FBD9A0" opacity=".8"/>
    <g fill="#1E1836">
      <path d="M240 116c10 34 16 52 16 74 0 18-8 30-16 44-8-14-16-26-16-44 0-22 6-40 16-74z"/>
      <path d="M136 158c9 28 14 44 14 62 0 16-6 26-14 38-8-12-14-22-14-38 0-18 5-34 14-62z"/>
      <path d="M344 158c9 28 14 44 14 62 0 16-6 26-14 38-8-12-14-22-14-38 0-18 5-34 14-62z"/>
      <path d="M62 196c7 22 11 34 11 48 0 13-5 21-11 30-6-9-11-17-11-30 0-14 4-26 11-48z"/>
      <path d="M418 196c7 22 11 34 11 48 0 13-5 21-11 30-6-9-11-17-11-30 0-14 4-26 11-48z"/>
      <rect x="30" y="272" width="420" height="20"/>
      <rect x="14" y="292" width="452" height="16"/>
    </g>
    <rect y="308" width="480" height="92" fill="#2B1F3F"/>
    <g fill="#EFA765" opacity=".2">
      <rect x="40" y="330" width="400" height="5" rx="2"/>
      <rect x="80" y="352" width="320" height="5" rx="2"/>
      <rect x="130" y="374" width="220" height="5" rx="2"/>
    </g>
  </svg>`,

  philippines: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-ph" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F6C86A"/>
        <stop offset=".42" stop-color="#F2A0A0"/>
        <stop offset=".44" stop-color="#2AA1B5"/>
        <stop offset="1" stop-color="#0B5F7A"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-ph)"/>
    <circle cx="110" cy="80" r="38" fill="#FFF0C4" opacity=".9"/>
    <g fill="#17555F">
      <ellipse cx="150" cy="176" rx="92" ry="22"/>
      <ellipse cx="368" cy="168" rx="66" ry="16"/>
      <path d="M120 176c6-56 26-64 38-20 6 22 16 20 24 20z"/>
    </g>
    <g fill="#123F4C">
      <rect x="196" y="120" width="6" height="56"/>
      <path d="M199 122c-22-16-38-14-46 2 18-8 32-6 46 4zM199 122c22-16 38-14 46 2-18-8-32-6-46 4zM199 118c-6-22 2-36 20-40-12 14-14 24-20 40zM199 118c8-20 20-28 38-22-16 2-28 10-38 22z"/>
      <rect x="352" y="126" width="5" height="42"/>
      <path d="M354 128c-18-12-30-10-36 2 14-6 24-4 36 4zM354 128c18-12 30-10 36 2-14-6-24-4-36 4z"/>
    </g>
    <rect y="176" width="480" height="224" fill="#1A8FA6" opacity=".25"/>
    <g fill="#EAF7F7" opacity=".38">
      <rect x="20" y="228" width="150" height="6" rx="3"/>
      <rect x="250" y="256" width="190" height="6" rx="3"/>
      <rect x="70" y="298" width="130" height="6" rx="3"/>
      <rect x="300" y="336" width="150" height="6" rx="3"/>
      <rect x="40" y="366" width="180" height="6" rx="3"/>
    </g>
  </svg>`,

  korea: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-kr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#16213F"/>
        <stop offset=".55" stop-color="#3E4E7B"/>
        <stop offset="1" stop-color="#C98AA0"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-kr)"/>
    <circle cx="392" cy="74" r="26" fill="#F3ECD7" opacity=".9"/>
    <path d="M0 244c60-56 104-62 148-18 44 44 92 40 148-16l72-58h112v292H0z" fill="#26304F" opacity=".8"/>
    <g fill="#151D36">
      <rect x="72" y="252" width="34" height="148"/>
      <rect x="116" y="282" width="26" height="118"/>
      <rect x="152" y="236" width="40" height="164"/>
      <rect x="204" y="292" width="30" height="108"/>
      <rect x="244" y="264" width="36" height="136"/>
      <rect x="290" y="300" width="24" height="100"/>
      <rect x="324" y="272" width="38" height="128"/>
      <rect x="372" y="294" width="28" height="106"/>
      <rect x="410" y="258" width="34" height="142"/>
      <rect x="166" y="176" width="8" height="62"/>
      <path d="M170 168c12 0 20 8 20 18h-40c0-10 8-18 20-18z"/>
    </g>
    <g fill="#E4B85C" opacity=".75">
      <rect x="80" y="288" width="6" height="8"/><rect x="92" y="308" width="6" height="8"/>
      <rect x="160" y="272" width="6" height="8"/><rect x="176" y="300" width="6" height="8"/>
      <rect x="252" y="296" width="6" height="8"/><rect x="264" y="330" width="6" height="8"/>
      <rect x="332" y="304" width="6" height="8"/><rect x="418" y="292" width="6" height="8"/>
    </g>
    <g fill="#0F1729">
      <path d="M0 372c40-26 92-26 132 0z"/>
      <path d="M0 366h132v8H0z"/>
    </g>
  </svg>`,

  nepal: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-np" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2F5C8C"/>
        <stop offset=".55" stop-color="#8FB4D0"/>
        <stop offset="1" stop-color="#E7DCC8"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-np)"/>
    <g fill="#6F8FB0" opacity=".55">
      <path d="M-20 300 90 148l70 90 60-66 90 128z"/>
      <path d="M250 300 340 178l54 68 46-48 70 102z"/>
    </g>
    <g fill="#43648C">
      <path d="M-10 340 110 172l60 82 52-58 96 144z"/>
      <path d="M270 340 366 208l46 58 40-42 58 116z"/>
    </g>
    <g fill="#F4F1E6">
      <path d="M80 214 110 172l30 42-22 8-16-12-14 10z"/>
      <path d="M344 240 366 208l24 32-16 6-12-10z"/>
      <path d="M434 236 452 212l20 28-14 6z"/>
    </g>
    <rect y="326" width="480" height="74" fill="#2E4661"/>
    <g stroke="#233A52" stroke-width="3" fill="none">
      <path d="M0 96c80 46 180 46 260 10s160-36 220 6"/>
    </g>
    <g>
      <path d="M22 108h26l-13 22z" fill="#D7483C"/>
      <path d="M70 122h26l-13 22z" fill="#2F72B8"/>
      <path d="M118 132h26l-13 22z" fill="#E8B23C"/>
      <path d="M168 138h26l-13 22z" fill="#3E9E6E"/>
      <path d="M218 136h26l-13 22z" fill="#F1EAD8"/>
      <path d="M268 128h26l-13 22z" fill="#D7483C"/>
      <path d="M318 120h26l-13 22z" fill="#2F72B8"/>
      <path d="M368 118h26l-13 22z" fill="#E8B23C"/>
      <path d="M418 124h26l-13 22z" fill="#3E9E6E"/>
    </g>
  </svg>`,

  israel: `
  <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-il" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1F3A6B"/>
        <stop offset=".38" stop-color="#E0794F"/>
        <stop offset=".58" stop-color="#F6C878"/>
        <stop offset="1" stop-color="#F2E4C4"/>
      </linearGradient>
    </defs>
    <rect width="480" height="400" fill="url(#sky-il)"/>
    <circle cx="118" cy="214" r="40" fill="#FBEBBE" opacity=".92"/>
    <g fill="#123A5E" opacity=".85">
      <rect x="258" y="150" width="30" height="112"/>
      <path d="M258 150h30l-15-22z"/>
      <rect x="296" y="174" width="26" height="88"/>
      <path d="M296 174h26l-13-18z"/>
      <rect x="330" y="196" width="24" height="66"/>
      <rect x="362" y="164" width="20" height="98"/>
      <rect x="390" y="206" width="34" height="56"/>
      <rect x="430" y="186" width="18" height="76"/>
      <rect x="222" y="214" width="26" height="48"/>
      <rect x="190" y="230" width="22" height="32"/>
    </g>
    <g fill="#F6C878" opacity=".55">
      <rect x="266" y="176" width="5" height="7"/><rect x="276" y="196" width="5" height="7"/>
      <rect x="302" y="192" width="5" height="7"/><rect x="310" y="218" width="5" height="7"/>
      <rect x="368" y="184" width="5" height="7"/><rect x="398" y="222" width="5" height="7"/>
    </g>
    <rect y="262" width="480" height="46" fill="#2E6E92"/>
    <g fill="#F6D9A0" opacity=".45">
      <rect x="20" y="274" width="120" height="4" rx="2"/>
      <rect x="210" y="288" width="160" height="4" rx="2"/>
      <rect x="90" y="300" width="110" height="4" rx="2"/>
    </g>
    <rect y="304" width="480" height="18" fill="#E6D2A6"/>
    <rect y="322" width="480" height="78" fill="#2B3140"/>
    <g fill="#F2E4C4" opacity=".75">
      <rect x="10" y="358" width="46" height="6"/>
      <rect x="82" y="358" width="46" height="6"/>
      <rect x="154" y="358" width="46" height="6"/>
      <rect x="226" y="358" width="46" height="6"/>
      <rect x="298" y="358" width="46" height="6"/>
      <rect x="370" y="358" width="46" height="6"/>
      <rect x="442" y="358" width="38" height="6"/>
    </g>
    <g fill="#3A4152">
      <rect x="0" y="330" width="480" height="3"/>
      <rect x="0" y="390" width="480" height="3"/>
    </g>
    <g fill="#7FA8C4">
      <rect x="24" y="226" width="4" height="36"/>
      <path d="M26 226c-14-10-24-8-28 2 11-5 19-3 28 3z"/>
      <path d="M26 226c14-10 24-8 28 2-11-5-19-3-28 3z"/>
      <rect x="452" y="232" width="4" height="30"/>
      <path d="M454 232c-12-8-20-6-24 2 9-4 16-3 24 2z"/>
      <path d="M454 232c12-8 20-6 24 2-9-4-16-3-24 2z"/>
    </g>
  </svg>`
};

/* ---------- השלבים ---------- */
const LEVELS = [
  {
    id: 'jp',
    country: 'יפן',
    place: 'טוקיו',
    tint: '#D8452F',
    scene: SCENES.japan,
    planes: 3,
    task: 'שלושת המטוסים תקועים בטור, אחד מתחת לשני. הפעילו את מסלול הטיסה של הלוח כדי שיעמדו בשורה אחת לרוחב, החל מהקצה השמאלי.',
    controls: ['display'],
    start: { 'display': 'block' },
    fixed: {},
    solution: { 'display': 'flex' },
    hint: 'כל עוד הלוח הוא block, המטוסים מתנהגים כבלוקים רגילים ונערמים מלמעלה למטה. המאפיין שהופך אותו למסלול אופקי הוא display.'
  },
  {
    id: 'vn',
    country: 'וייטנאם',
    place: 'מפרץ הא לונג',
    tint: '#D9A441',
    scene: SCENES.vietnam,
    planes: 3,
    task: 'המטוסים ממתינים להמראה בקצה המזרחי של המפרץ. העלו אותם לשורה אחת בחלקו העליון של הלוח, והצמידו את שלושתם לקצה הימני.',
    controls: ['display', 'justify-content'],
    start: { 'display': 'block', 'justify-content': 'flex-start' },
    fixed: {},
    solution: { 'display': 'flex', 'justify-content': 'flex-end' },
    hint: 'קודם הפעילו את ה‑Flexbox, ורק אז justify-content יתחיל להשפיע. הציר הראשי כאן הוא אופקי, וסופו נמצא בצד ימין.'
  },
  {
    id: 'la',
    country: 'לאוס',
    place: 'לואנג פראבנג',
    tint: '#F2B658',
    scene: SCENES.laos,
    planes: 4,
    task: 'מעל נהר המקונג המטוסים נכנסים לטור אנכי: אחד מתחת לשני, מהחלק העליון של הלוח כלפי מטה, כשכולם ממורכזים לרוחב הלוח.',
    controls: ['flex-direction', 'align-items'],
    start: { 'flex-direction': 'row', 'align-items': 'flex-start' },
    fixed: { 'display': 'flex' },
    solution: { 'flex-direction': 'column', 'align-items': 'center' },
    hint: 'כשהציר הראשי הופך לאנכי, הציר המשני הופך לאופקי — ואז align-items הוא זה שמזיז את המטוסים ימינה ושמאלה.'
  },
  {
    id: 'th',
    country: 'תאילנד',
    place: 'פוקט',
    tint: '#E2603F',
    scene: SCENES.thailand,
    planes: 4,
    task: 'נחיתה על המים: פרסו את ארבעת המטוסים בשורה אחת עם מרווחים שווים ביניהם — הראשון צמוד לקצה השמאלי והאחרון לקצה הימני — וכולם בתחתית הלוח.',
    controls: ['justify-content', 'align-items'],
    start: { 'justify-content': 'flex-start', 'align-items': 'flex-start' },
    fixed: { 'display': 'flex', 'flex-direction': 'row' },
    solution: { 'justify-content': 'space-between', 'align-items': 'flex-end' },
    hint: 'שימו לב להבדל: space-between מצמיד את הפריטים הקיצוניים לשוליים, בעוד space-around ו‑space-evenly משאירים רווח גם בקצוות.'
  },
  {
    id: 'kh',
    country: 'קמבודיה',
    place: 'אנגקור ואט',
    tint: '#EFA765',
    scene: SCENES.cambodia,
    planes: 4,
    task: 'טיסת חזרה מעל המקדש: רכזו את המטוסים בדיוק במרכז הלוח, ובסדר הפוך — מטוס מספר 1 יעמוד בקצה הימני של השורה ומטוס 4 בקצה השמאלי.',
    controls: ['flex-direction', 'justify-content', 'align-items'],
    start: { 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'flex-start' },
    fixed: { 'display': 'flex' },
    solution: { 'flex-direction': 'row-reverse', 'justify-content': 'center', 'align-items': 'center' },
    hint: 'row-reverse הופך את כיוון הציר הראשי, ולכן גם ההתחלה והסוף שלו מתחלפים. מרכוז מלא דורש גם justify-content וגם align-items.'
  },
  {
    id: 'ph',
    country: 'הפיליפינים',
    place: 'פלאוואן',
    tint: '#F6C86A',
    scene: SCENES.philippines,
    planes: 9,
    task: 'מבנה של תשעה מטוסים לא נכנס לשורה אחת. אפשרו לשורה להישבר לשתי שורות, מרכזו כל שורה לרוחב הלוח, ומרכזו את שתי השורות יחד לגובה הלוח.',
    controls: ['flex-wrap', 'justify-content', 'align-content'],
    start: { 'flex-wrap': 'nowrap', 'justify-content': 'flex-start', 'align-content': 'flex-start' },
    fixed: { 'display': 'flex', 'flex-direction': 'row' },
    solution: { 'flex-wrap': 'wrap', 'justify-content': 'center', 'align-content': 'center' },
    hint: 'align-content מסדר את השורות עצמן ולא את הפריטים, ולכן הוא משפיע רק כאשר flex-wrap מאפשר יותר משורה אחת.'
  },
  {
    id: 'kr',
    country: 'דרום קוריאה',
    place: 'סיאול',
    tint: '#E4B85C',
    scene: SCENES.korea,
    planes: 4,
    task: 'המראה מעל סיאול: המטוסים בטור אנכי שמתחיל בתחתית הלוח — מטוס 1 למטה ומעליו השאר — וכולם צמודים לקצה הימני.',
    controls: ['flex-direction', 'justify-content', 'align-items'],
    start: { 'flex-direction': 'row', 'justify-content': 'space-around', 'align-items': 'center' },
    fixed: { 'display': 'flex' },
    solution: { 'flex-direction': 'column-reverse', 'justify-content': 'flex-start', 'align-items': 'flex-end' },
    hint: 'ב‑column-reverse תחילת הציר הראשי היא למטה, ולכן flex-start מצמיד לתחתית. הצמדה לימין נעשית בציר המשני.'
  },
  {
    id: 'np',
    country: 'נפאל',
    place: 'קטמנדו',
    tint: '#D7483C',
    scene: SCENES.nepal,
    planes: 9,
    task: 'מעל ההימלאיה: סדרו את תשעת המטוסים בטורים אנכיים. כשטור מתמלא, המטוסים הבאים פותחים טור חדש. מרכזו כל טור לגובה הלוח, ואת כל הטורים יחד מרכזו לרוחב הלוח.',
    controls: ['flex-direction', 'flex-wrap', 'justify-content', 'align-content'],
    start: { 'flex-direction': 'row', 'flex-wrap': 'nowrap', 'justify-content': 'flex-start', 'align-content': 'flex-start' },
    fixed: { 'display': 'flex' },
    solution: { 'flex-direction': 'column', 'flex-wrap': 'wrap', 'justify-content': 'center', 'align-content': 'center' },
    hint: 'כשהכיוון אנכי והגלישה פעילה, כל "שורה" היא למעשה טור. justify-content מרכז בתוך הטור, ו‑align-content מרכז את הטורים זה מול זה.'
  },
  {
    id: 'il',
    country: 'ישראל',
    place: 'נתב״ג, תל אביב',
    tint: '#2F6FB5',
    scene: SCENES.israel,
    planes: 8,
    task: 'הטיסה האחרונה חוזרת הביתה. החזירו את שמונת המטוסים לשורות אופקיות שנשברות כשהן מתמלאות, פרסו את המטוסים בכל שורה עם מרווח שווה מסביב לכל מטוס, ודחפו את השורה העליונה לראש הלוח ואת השורה התחתונה אל מסלול הנחיתה שבתחתית.',
    controls: ['flex-direction', 'flex-wrap', 'justify-content', 'align-content'],
    start: { 'flex-direction': 'column', 'flex-wrap': 'nowrap', 'justify-content': 'center', 'align-content': 'flex-start' },
    fixed: { 'display': 'flex' },
    solution: { 'flex-direction': 'row', 'flex-wrap': 'wrap', 'justify-content': 'space-around', 'align-content': 'space-between' },
    hint: 'space-around נותן לכל מטוס מרווח משלו משני צדדיו, ולכן הרווח בקצוות קטן בחצי מהרווח שבין מטוסים. align-content: space-between דוחף את השורה הראשונה והאחרונה אל קצוות הלוח.'
  }
];
