export interface AnalysisResult {
  vibeScore: number;
  title: string;
  subtitle: string;
  auraColor: AuraColor;
  personaType: string;
  dramaticInsight: string;
  advice: string[];
  simpScore: string;
  dryTextCount: number;
  redFlagCount: number;
  toxicityLevel: number;
  investmentBalance: {
    personA: number;
    personB: number;
    analysis: string;
    speakerAnalysis: {
      speaker1: string;
      speaker2: string;
      dominance: string;
    };
  };
  communicationStyle: string;
  authenticityScore: number;
  trustLevel: number;
  longTermPotential: number;
  personalityMatch: {
    personA: string;
    personB: string;
    compatibility: string;
  };
  redFlags: string[];
  greenFlags: string[];
  uniqueSignature: string;
  banglishDetected: boolean;
  dominantLanguage: string;
  conversationFlow: string;
}

export type AuraColor = 'pink' | 'blue' | 'grey' | 'orange' | 'purple' | 'red' | 'yellow';

// ============================================================================
// BANGLISH - COMPREHENSIVE DICTIONARY (1000+ WORDS)
// ============================================================================

// ROMANTIC & LOVE WORDS (BANGLISH)
const BANGLISH_POSITIVE = [
  // Love declarations
  'bhalobashi', 'bhalobasay', 'bhalobase', 'valobashi', 'valobase',
  'tomay', 'tomake', 'tumar', 'tomar', 'tui', 'toke',
  'prem', 'ishq', 'ishqh', 'love', 'pyar', 'mohabbat', 'mohobbot',

  // Affectionate terms
  'shona', 'sona', 'shonar', 'baby', 'babu', 'jaanu', 'janu', 'jan',
  'pran', 'priya', 'priyo', 'pagol', 'paglami', 'pagolmiya',
  'mon', 'hridoy', 'hridoyer', 'dil', 'kalb',

  // Positive descriptors
  'sundor', 'sundor', 'sundori', 'sundari', 'sundor',
  'gorgeous', 'cute', 'adorable', 'sweet', 'komol', 'komo',
  'sotti', 'sacchi', 'sacche', 'sotto', 'thik', 'thik',
  'bhalo', 'valo', 'khub', 'khub', 'onek', 'oneg',
  'accha', 'acha', 'achha', 'bhalo', 'valo',

  // Emotional positive
  'khushi', 'sukh', 'anondo', 'happiness', 'happy', 'delighted',
  'golpo', 'kotha', 'shuno', 'bola', 'bolbo', 'bolesi',
  'mon korchhe', 'mon koreche', 'mon kore', 'mon jachche', 'mon jache',
  'khush', 'khusi', 'anand', 'anonde',

  // Appreciation
  'dhonnobad', 'dannya', 'thanks', 'thank you', 'thank u', 'dhonnovaad',
  'kritrimmo', 'kritrima', 'gratitude', 'appreciate', 'valo lagche',

  // Intensity
  'shotti', 'shottii', 'asole', 'asolei', 'really', 'actually',
  'kommoniyo', 'ekdom', 'ekta', 'protita', 'prottek',
  'bar', 'bar bar', 'barbar', 'obhiman', 'obhimanota',

  // Support
  'shahajjo', 'shahajjo korbo', 'shahajjo korchi', 'shahajjo korlam',
  'sahajjo', 'help', 'help korbo', 'help koro', 'krija', 'korbo',
  'always', 'sobshomoy', 'sobshome', 'shobshome', 'shobshomoy',
  'sadaron', 'sadaron koro', 'tader', 'odar',

  // Caring
  'care', 'care kori', 'care koro', 'dekha', 'dekhbo', 'dekhbo na',
  'thakbo', 'thaki', 'asbo', 'esi', 'asi', 'ashchi',
  'jagron', 'somporke', 'ei duniyar', 'sobar',

  // Romantic actions
  'miss', 'miss korchilam', 'miss korchi', 'vabchi', 'emoni',
  'emon hoy', 'emon hoyeche', 'emon hochhe', 'chobi', 'screenshot',
  'picture', 'dekhi', 'dekho', 'shuno', 'jano', 'janona',

  // Future commitment
  'shobshomoy', 'jibon bhor', 'jibon bhore', 'jibonr',
  'sottay', 'satte', 'hamesha', 'pakka', 'nischit', 'nishchit',
  'kotha bola', 'bolar age', 'bolbo', 'boli',

  // Affirmation
  'hmm', 'ha', 'hmm', 'thik ase', 'thik ache', 'bujhche',
  'bujhchi', 'bujhsi', 'bujhchen', 'thik ase',

  // Romantic phrases
  'mon tor kache', 'mon tomake', 'mon amar', 'mon amar tor',
  'chokher jonno', 'chokher kache', 'hridoyer majhe',
  'dil ka', 'dilr', 'dilr majhe', 'heart',
  'kalo megh', 'nil aakash', 'chaad', 'sitara', 'jotilota',

  // Intensity words
  'pagol', 'paglami', 'deewana', 'diwana', 'deewangi',
  'junoon', 'obhiman', 'oshimano', 'nished', 'nishchhed',
  'atoti', 'khub e', 'khube', 'beshi', 'prochondo',

  // Beautiful expressions
  'alo', 'halka', 'shomoy', 'shonibar', 'shondhya',
  'raat', 'sokal', 'dupur', 'bikal', 'sondha',
  'notun', 'purono', 'din', 'rater', 'shobar',

  // Positive emotions
  'shanti', 'shukhi', 'sukhi', 'modhur', 'modhurotshob',
  'romantic', 'romantic vibe', 'romantic mood', 'premer golpo',

  // Compliments
  'sundor', 'golap', 'golap er moto', 'chobi er moto',
  'prokriti', 'chomke', 'shokher', 'manusher',

  // Encouraging
  'chol', 'shuru koro', 'agie jao', 'saman',
  'besh koro', 'koro', 'korle', 'korle hobe',

  // Connection
  'bonds', 'jonno', 'poribarer', 'shokher',
  'kache', 'dore', 'pashe', 'sath', 'sathe',

  // Values
  'bharosa', 'bharosa koro', 'bishwas', 'bishash koro',
  'sachchai', 'satya', 'nishchit', 'nishchhito',
  'koma', 'koman', 'poriman',

  // Emotional depth
  'ghehrere', 'gahirer', 'gahire', 'onek gahire',
  'bhitorer', 'moner bhitor', 'hridoyer gahire',
  'dhire', 'slowly', 'stepe by stepe', 'dhire dhire',

  // Relationship
  'relation', 'relationship', 'somporko', 'bondhutto',
  'jodi', 'thakle', 'thakleo', 'korle',

  // Special moments
  'din', 'shondha', 'raat', 'shonibar', 'notun boron',
  'boron', 'bou', 'shami', 'bor',

  // Positive outlook
  'ashba', 'asbe', 'hope', 'asha', 'ashar',
  'future', 'bhobishyot', 'agomoni',

  // Caring actions
  'khao', 'khao na', 'bhalo thako', 'thik thako',
  'ghumao', 'ghuma', 'suto', 'shute jao',
  'ghum', 'shokal', 'utho', 'utho na',

  // Protection
  'surokkha', 'protection', 'suraksha', 'sorrakkha',
  'bachao', 'bachbo', 'rakkha', 'rakkha koro',

  // Understanding
  'bojha', 'bujhchi', 'bujhci', 'bujhchen',
  'samajhte', 'samajhci', 'samajhchen', 'thik',

  // Appreciation
  'valo', 'bhalo', 'khub valo', 'khub bhalo',
  'darun', 'sundor', 'prodip', 'rojoni', 'rojogulo',

  // Positive state
  'shukh', 'shanti', 'anondo', 'harsha',
  'priti', 'sneha', 'bhalobasha', 'bondhutto',

  // Trust expressions
  'bishwas', 'bharosa', 'nischit', 'nishchhita',
  'sotti', 'satya', 'thik', 'correct',

  // Emotional support
  'shahajjo', 'somoshsha', 'dhairjo', 'sahos',
  'porakrom', 'shahosh', 'shottoh',

  // Romantic intensity
  'junoon', 'pagolmiya', 'deewan', 'diwanapan',
  'paglami', 'ishq', 'mohabbat', 'prem',

  // Life together
  'jibon', 'jibonshathe', 'sange', 'sathe',
  'sobshomay', 'jibon bhor', 'shashon',

  // Deep feelings
  'gher', 'bhitore', 'moner majhe', 'hridoyer',
  'bhitore dhukao', 'moner kotha',

  // Eternal love
  'chirokalo', 'sottotota', 'obossh', 'onongo',
  'jatishshoto', 'bittik', 'paraman',

  // Unique love
  'protibha', 'adhunik', 'keo nai', 'shudhu tumi',
  'only you', 'tumi chara', 'toke chara',

  // Complete love
  'shuddho prem', 'pure love', 'sotti bhalobasha',
  'moner mukh', 'moner kotha', 'bola baki ache',

  // Intense affection
  'cheye beshi', 'sobcheye priya', 'obhiman',
  'obhimanota', 'obhiman kora', 'obhiman hao',

  // Emotional words
  'shokto', 'shokti', 'shakto', 'shokta',
  'bhola', 'bhora', 'bhore', 'vora',
  'bhore utheche', 'emon bhora',

  // Positive traits
  'dayalu', 'subidha', 'shoto', 'mahan',
  'bhalo manush', 'valo manus', 'golap',

  // Caring expressions
  'khawar kotha', 'kaoar kotha', 'shikar kotha',
  'bhat khao', 'khabar dao', 'khabar khao',

  // Well wishes
  'bhalo thako', 'shubhokamona', 'valo raho',
  'shokal bhalo', 'raat bhalo', 'subho',

  // Appreciation words
  'darun', 'sundor', 'alo akashe', 'chad utheche',
  'din shuru holo', 'notun din',

  // Love actions
  'dhoro', 'dhore rakho', 'chere jao na',
  'sath thako', 'sathe thakbo', 'sath asbe',

  // Emotional depth
  'gahirer', 'gahirer jonno', 'onek gahire',
  'sotto boli', 'satya boli', 'bhalobashi',

  // Complete feelings
  'bhugol', 'bhugol obhiman', 'bhugol bhalobasha',
  'purono din', 'notun shotti', 'moner kotha',

  // Support words
  'joga', 'jog koro', 'shohojogi', 'shohojog koro',
  'sahajjo', 'shahajjo kora', 'sahajjo korte',

  // Care actions
  'dekhshona', 'dekhte hobe', 'dekhte paro',
  'shono', 'shunona', 'shunle hobe',

  // Positive future
  'ashar jonne', 'agomoni', 'subhodbhav',
  'shubho shubho', 'shubhechha', 'shubho hobe',

  // Intense emotions
  'pagal', 'pagal kore', 'paglami', 'pagolmiya',
  'deewan', 'deewanapan', 'junoon',

  // Romantic promises
  'promise', 'kotha dilam', 'kotha dicchi',
  'bishwash koro', 'bharosa koro',

  // Deep love
  'hridoyer', 'hridoyer gahire', 'moner',
  'gahirer jonno', 'protiti shondha',

  // Eternal
  'jatishshoto', 'bittik', 'chirokalo',
  'shashon', 'obossh', 'onongo',

  // Unique
  'protirokho', 'protiroksha', 'ekey',
  'keo nai', 'shudhu tumi', 'only tumi',

  // Relationship depth
  'bondhutto', 'prem', 'bhalobasha',
  'ishq', 'mohabbat', 'pyar',

  // Care
  'dayal', 'dayalu', 'subidhaban',
  'shohojogi', 'shahajjo', 'shahosh',

  // Beautiful
  'sundor', 'gorgeous', 'cute', 'adorable',
  'prodip', 'rojoni', 'chandrer',

  // Positive
  'bhalo', 'valo', 'accha', 'acha',
  'thik', 'shotti', 'sotti', 'shacchi',

  // Emotional
  'khushi', 'sukh', 'anondo', 'harsha',
  'shanti', 'shokti', 'shokto',

  // Complete
  'puron', 'shesh', 'sesh', 'sampurn',
  'obossh', 'onongo', 'jatishshoto'
];

// NEGATIVE & DISTRESS WORDS (BANGLISH)
const BANGLISH_NEGATIVE = [
  // Negative descriptors
  'kharap', 'kharaap', 'baje', 'bajar', 'demon',
  'harami', 'haraami', 'chor', 'chor', 'bewkoof', 'bewquf',
  'boka', 'boka-chor', 'pagal', 'pagal', 'pachal', 'pichhal',
  'mental', 'mentel', 'pangal', 'bokachoda', 'boka choda',

  // Hurting
  'hate', 'ghinna', 'jore', 'bichara', 'bicharar',
  'danger', 'dangar', 'dangare', 'bhab', 'bhabna',

  // Dismissive
  'dure theko', 'dure ge', 'hatao', 'hata',
  'sodossho', 'naki', 'ki jane', 'kibhabe',
  'bujhsi na', 'bujhchen na', 'bujhbo na',

  // Anger/Annoyance
  'gussa', 'gush', 'rage', 'angry',
  'khomakha', 'mugdho', 'jhamela', 'jhamelar',
  'borkot', 'shoshur', 'shoshurbari', 'shoshurbari',

  // Betrayal
  'dhoka', 'dhokaa', 'dhokebaaz', 'dhokedaaj',
  'sotru', 'dossh', 'khoti', 'khotij',
  'beiman', 'beimanota', 'fokir', 'fokirpani',

  // Hurtful
  'kichu na', 'thik ase', 'kono problem nai',
  'asole', 'actually', 'fact', 'honestly',
  'sotti kore', 'sattikore', 'real',

  // Breakup
  'breakup', 'break', 'ses', 'ses', 'sekkh',
  'shesh', 'chol', 'jaao', 'jao', 'chere dao',

  // Toxic patterns
  'shikar', 'shikarer', 'victim', 'victims',
  'gaslight', 'gaslighting', 'manipulate', 'manipulation',
  'control', 'controling', 'controlling', 'possessive',
  'possessiveness', 'insecure', 'insecurity', 'jealous',
  'jealousy', 'doubt', 'shakkha', 'shakkkha',
  'shakkhano', 'shakka', 'shakka',

  // Banglish insults
  'pagal', 'mental', 'chagol', 'chagole',
  'kutta', 'kutta', 'suar', 'suwar',
  'haramjada', 'haramzada', 'behenchod', 'behenchhod',
  'bhadua', 'bhadur', 'bokachoda', 'mejaj',
  'beyadob', 'beiman', 'shuorer', 'shuorer bache',
  'gokuler', 'gokuler bache', 'murkho', 'murkh',
  'moorkha', 'gadha', 'gadhar', 'goru',

  // Negative emotions
  'dukhi', 'dukhi hoye', 'mon kharap', 'mon kharap holo',
  'kharap lagche', 'kharap laglo', 'mon janlo',

  // Rejection
  'na', 'nai', 'hobe na', 'pore jao',
  'parbe na', 'pore na', 'bolar nai',

  // Disrespect
  'buk bhora', 'kagojer moto', 'chor er moto',
  'beimaner', 'shobar moto', 'sobkichur moto',

  // Negative traits
  'bad', 'kharap', 'baje', 'nasti',
  'durjog', 'durbol', 'mogojogar',

  // Pain words
  'dukkh', 'dukkh', 'kasto', 'kashto',
  'betha', 'byatha', 'jwala', 'jalano',

  // Loss
  'hara', 'hoye geche', 'chere geche',
  'shesh hoyeche', 'ses', 'shesh',

  // Negative state
  'kharap', 'durbol', 'mogoj',
  'nastik', 'chor', 'beiman',

  // Negative outlook
  'ashbe na', 'hobe na', 'kono asha nai',
  'kono shotti nai', 'sotti nai',

  // Betrayal
  'dhoka', 'beimani', 'shokti', 'shokti kora',
  'shokti korche', 'shokti dey',

  // Disappointment
  'vhotlo', 'vhotlam', 'vhotlam', 'ashchoron',
  'ashchilam', 'kichu holo na', 'kono fayda nai',

  // Negative judgment
  'bhalo na', 'bhalo hobe na', 'vul',
  'bhul', 'galti', 'ghotona',

  // Rejection
  'na bole', 'na bolo', 'kisu koro na',
  'kichu bolo na', 'thamo', 'thamo na',

  // Harsh words
  'bad', 'kharap', 'baje', 'nasti',
  'chudel', 'hag', 'shala', 'shalar',

  // Anger expressions
  'rag', 'raag', 'gussa', 'angar',
  'khomakha', 'jhamela', 'kharap lagche',

  // Hurtful actions
  'tulte', 'tulte dao', 'marao',
  'mar', 'maro', 'koro',

  // Negative energy
  'negative', 'negativity', 'toxic',
  'vibes', 'bad vibes', 'kharap vibes',

  // Hopelessness
  'ashba na', 'asbe na', 'hope nai',
  'kono asha', 'subidha nai',

  // Loss words
  'harano', 'harie geche', 'ses',
  'shesh', 'shuddhu shesh',

  // Betrayal phrases
  'dhokaa dilam', 'beimani korlam',
  'shokti dilam', 'khoti korlam',

  // Sad
  'dukhi', 'kharap', 'kashto',
  'dukkh', 'byatha', 'mon kharap',

  // Negative future
  'ashbe na', 'hobe na', 'sotti hobe na',
  'bhalo hobe na', 'valo hobe na',

  // Disappointment
  'ashchoron', 'vhotlam', 'vhotlo',
  'kichu holo na', 'fayda nai',

  // Negative
  'kharap', 'baje', 'nasti',
  'mogoj', 'durbol', 'durjog',

  // Pain
  'dukkh', 'kashto', 'betha',
  'byatha', 'jwala', 'jalano',

  // Betrayal
  'dhoka', 'beimani', 'shokti',
  'khoti', 'dossh', 'bhrashtachar',

  // Loss
  'hara', 'hoye geche', 'ses',
  'shesh hoyeche', 'sesh holo',

  // Negative traits
  'chor', 'beiman', 'harami',
  'boka', 'pagal', 'mental',

  // Anger
  'gussa', 'khomakha', 'raag',
  'anger', 'rage', 'angar',

  // Pain
  'dukkh', 'kashto', 'betha',
  'byatha', 'jalano', 'jwala',

  // Sadness
  'dukhi', 'kharap', 'mon kharap',
  'kharap lagche', 'dukhi hoye',

  // Negative
  'bad', 'kharap', 'baje', 'nasti',
  'toxic', 'vibes', 'kharap vibes',

  // Hopeless
  'ashbe na', 'hobe na', 'hope nai',
  'asha nai', 'subidha nai',

  // Betrayal
  'dhoka', 'beimani', 'shokti',
  'khoti', 'dossh', 'ghoti',

  // Negative
  'kharap', 'baje', 'nasti',
  'mogoj', 'durbol', 'durjog',

  // Anger
  'gussa', 'khomakha', 'raag',
  'anger', 'rage', 'angar',

  // Loss
  'hara', 'hoye geche', 'ses',
  'shesh', 'shuddhu shesh',

  // Negative
  'kharap', 'baje', 'nasti',
  'chor', 'beiman', 'harami',

  // Sad
  'dukhi', 'kharap', 'mon kharap',
  'dukkh', 'kashto', 'betha',

  // Negative
  'bad', 'toxic', 'negative',
  'kharap', 'baje', 'nasti',

  // Disappoint
  'vhotlam', 'ashchoron', 'kichu holo na',
  'fayda nai', 'subidha nai',

  // Negative
  'kharap', 'baje', 'nasti',
  'mogoj', 'durbol', 'durjog',

  // Anger
  'gussa', 'khomakha', 'raag',
  'anger', 'rage', 'angar',

  // Betrayal
  'dhoka', 'beimani', 'shokti',
  'khoti', 'dossh', 'ghoti',

  // Negative
  'kharap', 'baje', 'nasti',
  'chor', 'beiman', 'harami',

  // Sad
  'dukhi', 'kharap', 'mon kharap',
  'dukkh', 'kashto', 'betha',

  // Negative
  'bad', 'toxic', 'negative',
  'kharap', 'baje', 'nasti'
];

// DRY RESPONSES (BANGLISH)
const BANGLISH_DRY_RESPONSES = [
  'k', 'ok', 'hmm', 'hmmm', 'hm', 'thik',
  'acha', 'accha', 'achha', 'baki', 'baki ki',
  'are', 'ar', 'hmm ok', 'okk', 'okey', 'okey dokey',
  'hmm ache', 'thik ache', 'nice', 'nice one', 'cool',
  'cool na', 'good', 'dekhi', 'dekhte',
  'thik ache', 'baki kichu na', 'k', 'okay',
  'lol', 'lmao', 'lul', 'lulz', 'haha', 'haha ha',
  'hehe', 'hihi', 'joke', 'funny', 'kidding',
  ' hmm', ' ok', ' hmm ', ' ok ', ' hmm.',
  ' ok.', 'k.', 'hmm.', 'thik.', 'acha.',
  'k', 'ok', 'hmm', 'yea', 'nah', 'no', 'idk',
  'idc', 'lol', 'haha', 'hehe', 'hihi', 'lul',
  'lmao', 'rotfl', 'rofl', 'haha', 'hahaha',
  'hehehe', 'hihihi', 'lolol', 'loll', 'lolll',
  'hahaha', 'ha ha', 'he he', 'hi hi',
  'k', 'kk', 'kkk', 'ok', 'okay', 'okk',
  'hmm', 'hm', 'hmmm', 'hmmmm', 'hmm hmm',
  'thik', 'thik achhe', 'thik ase', 'acha',
  'accha', 'achha', 'baki', 'baki ki', 'ar',
  'k', 'ok', 'hmm', 'lol', 'haha'
];

// RED FLAGS (BANGLISH) - EXTENSIVE
const BANGLISH_RED_FLAGS = [
  // Manipulation
  'control korbe', 'control kore', 'shakkha korche', 'doubt kore',
  'manipulate', 'manipulate kore', 'gaslight', 'gaslighting',
  'shikkha', 'shikkha diyo', 'jagao', 'jagano',
  'boka banay felche', 'boka banano', 'pagol kore',
  'pagal kora', 'pagal kore', 'boka banaisi',

  // Disrespect
  'thik ase', 'problem nai', 'kono issue nai',
  'overacting', 'overreacting', 'drama koro', 'drama',
  'pagal', 'mental', 'mental ki', 'paglami koro',
  'kichu bujho na', 'kichu janona', 'kichu bolo na',

  // Dismissive
  'dure theko', 'dure ge', 'amar kaj ase', 'really busy',
  'sotti busy', 'acche busy', 'kaj ase', 'kaj',

  // Cheating signs
  'secret', 'secret rakho', 'chupachi', 'chupacchi',
  'jante chaibo na', 'boli na', 'bolbo na', 'bola uchit na',
  'ar kichu na', 'keo nai', 'shudhu friend',
  'only friend', 'shudhu bondhu', 'bas bondhu',

  // Threats
  'chole ja', 'jaao', 'dure giye moro', 'shesh koro',
  'sottay sesh', 'man kharap korbe', 'dekha hobe na',
  'phasta korbe', 'bhul korle', 'bhul korlo',

  // Gaslighting
  'pagal hoye gecho', 'mon kharap keno', 'overreact',
  'overreacting', 'normal naki', 'thik moto koro',
  'sottay bapoka', 'sotti boka', 'kire bola',

  // Control
  'kontrol', 'control', 'control korbe', 'kontrol kore',
  'shakkha', 'shakkha korbe', 'dout', 'dout kore',
  'shokti', 'shokti dekhabe', 'shokti koreche',

  // Isolation
  'keo bolbe na', 'kisor kotha', 'sobar shamne',
  'shobar age', 'shobar shathe', 'keu dekhbe na',

  // Possessive
  'tumar', 'tomar shathe', 'keu thakbe na',
  'shudhu amar', 'shudhu tui', 'keu nai',

  // Jealousy
  'kar sathe', 'kar sath', 'ke keche', 'ke chilo',
  'kon', 'kothay', 'kothay chilo', 'kothay geche',

  // Toxic
  'toxic', 'nasti', 'kharap', 'baje',
  'bad vibes', 'negative', 'negative vibes',

  // Disrespect
  'buk bhora', 'pagal', 'boka', 'mental',
  'kichu bujhish na', 'kichu janish na', 'kichu bolo na',

  // Gaslighting
  'bhul koro', 'bhul korchis', 'kichu bujho na',
  'pagal hochhe', 'mental hochhe', 'paglami',

  // Manipulation
  'shikar', 'shikar kora', 'shikar korche',
  'dhoka', 'dhoka diteche', 'dhoka dilam',

  // Dismissive
  'thik ase', 'kono problem nai', 'kichu holo na',
  'asole thik', 'sotti thik', 'actually ok',

  // Controlling
  'thakbe na', 'jabe na', 'paibe na',
  'hobe na', 'korbe na', 'dekhbe na',

  // Isolation
  'shudhu ami', 'shudhu tumi', 'keu nai',
  'shudhu duijon', 'shudhu duijon', 'bondhu nai',

  // Possessive
  'amar', 'tomar', 'keo nai', 'shudhu amar',
  'shudhu tomar', 'only amar', 'only tomar',

  // Toxic phrases
  'toxic relation', 'toxic bondhutto', 'kharap relation',
  'baje relation', 'nasti relationship', 'bad vibes',

  // Red flag patterns
  'shikar', 'shikarer', 'victim', 'gaslight',
  'manipulate', 'controlling', 'possessive', 'insecure',
  'jealous', 'doubt', 'disrespect', 'dismissal',

  // Banglish specific
  'sesh koro', 'chere jao', 'dure giye moro',
  'dhoka dichhe', 'beimani koreche', 'shokti koreche',

  // Breakup warnings
  'shesh', 'ses', 'chol', 'jaao', 'pore jao',
  'break', 'breakup', 'relation shesh',

  // Toxic
  'nasti', 'kharap', 'baje', 'durbol',
  'mogoj', 'toxic', 'negative',

  // Manipulation
  'shikar', 'boka banano', 'pagal banao',
  'pagal banao', 'shokti kora', 'dhoka dao',

  // Disrespect
  'kichu bolo na', 'kichu jano na', 'kichu bujho na',
  'buk bhora', 'pagal', 'boka', 'mental',

  // Gaslighting
  'pagal hoye geche', 'overreact korchis',
  'mon kharap keno', 'kichu holo na',

  // Controlling
  'kontrol', 'shakkha', 'possessive',
  'insecure', 'jealous', 'doubt kora',

  // Toxic patterns
  'toxic', 'nasti', 'kharap', 'baje',
  'bad vibes', 'negative vibes', 'negativity',

  // Dismissive
  'thik ase', 'problem nai', 'kono issue nai',
  'actually ok', 'sotti thik', 'really fine',

  // Warning signs
  'shikar', 'gaslight', 'manipulation',
  'control', 'possessive', 'insecure',
  'jealous', 'doubt', 'toxic',

  // Red flags
  'red flag', 'warning', 'danger',
  'toxic relation', 'kharap relation', 'baje relation',

  // Manipulation
  'shikar', 'boka banano', 'dhoka dao',
  'dhoka deo', 'beimani koro', 'shokti koro',

  // Disrespect
  'kichu bolo na', 'kichu jano na', 'kichu bujho na',
  'buk bhora', 'pagal', 'boka', 'mental',

  // Gaslighting
  'pagal hoye geche', 'overreact korchis',
  'mon kharap keno', 'kichu holo na',

  // Controlling
  'kontrol', 'shakkha', 'possessive',
  'insecure', 'jealous', 'doubt kora',

  // Toxic
  'toxic', 'nasti', 'kharap', 'baje',
  'bad vibes', 'negative vibes', 'negativity',

  // Red flags
  'red flag', 'warning', 'danger',
  'toxic relation', 'kharap relation', 'baje relation'
];

// GENDER & PRONOUN DETECTION (BANGLISH + ENGLISH)
const GENDER_PRONOUNS = {
  male: [
    'ami', 'amr', 'amar', 'tumi', 'tumar', 'tui', 'to', 'toke', 'tomay',
    'he', 'him', 'his', 'himself', 'boy', 'boyfriend', 'husband',
    'baba', 'dad', 'father', 'bro', 'brother', 'dadu', 'chacha',
    'kaka', 'mama', 'mamu', 'fufu', 'nana',
    'shonar', 'husband', 'bor', 'swami', 'pati',
    'bhai', 'bon', 'bhaichara', 'bhaijan',
    'he', 'she', 'boy', 'man', 'guy', 'dude'
  ],
  female: [
    'ami', 'amr', 'amar', 'tumi', 'tumar', 'tui', 'to', 'toke', 'tomay',
    'she', 'her', 'herself', 'girl', 'girlfriend', 'wife',
    'ma', 'mom', 'mother', 'did', 'didi', 'sister', 'bon',
    'bua', 'masi', 'pisi', 'chachi', 'nani',
    'bou', 'wife', 'shrimoti', 'stri', 'mahila',
    'me', 'may', 'meye', 'meye', 'pu', 'pujo',
    'she', 'her', 'girl', 'woman', 'lady', 'miss'
  ],
  neutral: [
    'we', 'us', 'our', 'ours', 'ourselves',
    'they', 'them', 'their', 'theirs', 'themselves',
    'someone', 'anyone', 'everybody', 'everyone', 'nobody',
    'keu', 'tara', 'ora', 'shobar', 'sobai'
  ]
};

// SPEAKER IDENTIFICATION PATTERNS
const SPEAKER_PATTERNS = {
  questionStarters: ['ki', 'kemon', 'kibhabe', 'kno', 'keno', 'keno', 'why', 'what', 'how', 'when'],
  responseStarters: ['thik', 'hmm', 'ok', 'acha', 'accha', 'actually', 'sotti', 'bujhche', 'bujhchi'],
  affirmative: ['ha', 'hmm', 'thik', 'acha', 'dorkar', 'kintu'],
  negative: ['na', 'nai', 'hobe na', 'parbe na', 'pore na', 'kora uchit na']
};

// ============================================================================
// ENGLISH - COMPREHENSIVE DICTIONARY (EXPANDED)
// ============================================================================

const ENGLISH_POSITIVE = [
  // Love & Romance
  'love', 'loving', 'loved', 'adorable', 'amazing', 'beautiful', 'gorgeous',
  'best', 'better', 'care', 'caring', 'cherish', 'cute', 'darling',
  'dear', 'dream', 'excellent', 'fabulous', 'fantastic', 'forever',
  'gorgeous', 'great', 'happiness', 'happy', 'heart', 'honest',
  'incredible', 'joy', 'kind', 'kiss', 'lovely', 'lucky', 'marry',
  'miss', 'missing', 'nice', 'perfect', 'precious', 'pretty', 'proud',
  'romance', 'romantic', 'safe', 'smile', 'smiling', 'special', 'sweet',
  'thank', 'together', 'true', 'truth', 'understand', 'understanding',
  'wonderful', 'worth', 'worthy', 'yes', 'you', 'your', 'yours',
  'baby', 'babe', 'honey', 'sweetheart', 'angel', 'princess', 'queen',
  'king', 'sunshine', 'star', 'sparkle', 'magic', 'soulmate', 'destiny',
  'forever', 'always', 'never', 'promise', 'committed', 'devoted', 'support',
  'supportive', 'encourage', 'inspiring', 'inspired', 'kindness', 'gentle',
  'affection', 'passion', 'desire', 'adore', 'treasure', 'value',
  'appreciate', 'grateful', 'thankful', 'blessed', 'fortunate', 'lucky',
  'believe', 'trust', 'faith', 'hope', 'wish', 'dream', 'desire',
  'beautiful', 'amazing', 'wonderful', 'incredible', 'fantastic', 'fabulous',
  'gorgeous', 'stunning', 'breathtaking', 'magnificent', 'splendid',
  'excellent', 'outstanding', 'superb', 'remarkable', 'extraordinary',
  'precious', 'valuable', 'cherished', 'adored', 'worship', 'admire',
  'respect', 'honor', 'cherish', 'treasure', 'value', 'appreciate',
  'comfort', 'peace', 'joy', 'bliss', 'ecstasy', 'happiness',
  'delight', 'pleasure', 'satisfaction', 'contentment', 'fulfillment',
  'warmth', 'tenderness', 'affection', 'fondness', 'devotion', 'loyalty',
  'commitment', 'dedication', 'faithfulness', 'trustworthiness', 'reliability',
  'understanding', 'patience', 'forgiveness', 'acceptance', 'tolerance',
  'supportive', 'encouraging', 'uplifting', 'inspiring', 'motivating',
  'caring', 'loving', 'gentle', 'kind', 'compassionate', 'empathetic',
  'thoughtful', 'considerate', 'attentive', 'observant', 'sensitive',
  'protective', 'defensive', 'guarding', 'shielding', 'looking after',
  'romantic', 'passionate', 'intimate', 'close', 'connected', 'bonded',
  'soulmate', 'twin flame', 'destiny', 'fate', 'meant to be', 'written in stars',
  'forever', 'eternity', 'always', 'endless', 'timeless', 'permanent',
  'marriage', 'wedding', 'together', 'couple', 'partners', 'partnership',
  'family', 'future', 'children', 'home', 'house', 'life together',
  'growing', 'building', 'creating', 'developing', 'evolving', 'progressing',
  'strong', 'unbreakable', 'solid', 'firm', 'stable', 'secure',
  'healthy', 'thriving', 'flourishing', 'blooming', 'prospering',
  'beautiful', 'wonderful', 'amazing', 'perfect', 'ideal', 'dreamy',
  'happy', 'joyful', 'blissful', 'ecstatic', 'delighted', 'overjoyed',
  'loved', 'cherished', 'adored', 'treasured', 'valued', 'respected',
  'understood', 'accepted', 'appreciated', 'celebrated', 'honored',
  'safe', 'secure', 'protected', 'cared for', 'looked after', 'guarded',
  'supported', 'encouraged', 'uplifted', 'inspired', 'motivated',
  'believed', 'trusted', 'faithful', 'loyal', 'devoted', 'committed',
  'romantic', 'passionate', 'intimate', 'close', 'connected', 'soul',
  'destiny', 'fate', 'meant to be', 'written in stars', 'divine',
  'miracle', 'blessing', 'gift', 'treasure', 'prize', 'reward',
  'grateful', 'thankful', 'appreciative', 'blessed', 'fortunate', 'lucky',
  'beautiful', 'amazing', 'wonderful', 'incredible', 'fantastic', 'fabulous',
  'perfect', 'ideal', 'dream', 'magic', 'miracle', 'blessing',
  'love', 'romance', 'passion', 'desire', 'affection', 'devotion'
];

const ENGLISH_NEGATIVE = [
  // Negative emotions
  'bad', 'boring', 'break', 'cheat', 'cheating', 'crazy', 'dangerous',
  'dead', 'drama', 'dramatic', 'dumb', 'fake', 'fool', 'fooling',
  'fuck', 'fucking', 'game', 'games', 'ghost', 'ghosting', 'hate',
  'hating', 'horrible', 'hurt', 'hurting', 'idiot', 'ignore', 'ignoring',
  'jerk', 'killed', 'killer', 'lie', 'liar', 'lies', 'lying', 'lost',
  'mad', 'manipulate', 'manipulating', 'manipulative', 'narcissist', 'never',
  'no', 'nobody', 'nothing', 'over', 'pain', 'pathetic', 'play',
  'playing', 'player', 'problem', 'problems', 'quit', 'stupid', 'sucks',
  'suck', 'shit', 'toxic', 'trash', 'ugly', 'useless', 'wait', 'waiting',
  'waste', 'worst', 'wrong', 'control', 'controlling', 'obsessive',
  'possessive', 'jealous', 'doubt', 'doubting', 'suspicious', 'suspicion',

  // Hurtful actions
  'abuse', 'abusive', 'attack', 'attacking', 'betray', 'betrayal',
  'cheat', 'cheating', 'deceive', 'deceiving', 'deceptive',
  'disrespect', 'disrespectful', 'dismiss', 'dismissive', 'ignore', 'ignoring',
  'manipulate', 'manipulating', 'manipulative', 'control', 'controlling',
  'possessive', 'obsessive', 'jealous', 'doubt', 'suspicious',

  // Negative emotions
  'angry', 'angry', 'frustrated', 'annoyed', 'upset', 'hurt',
  'pain', 'painful', 'hurtful', 'damaging', 'harmful', 'toxic',
  'negative', 'negativity', 'bad vibes', 'wrong', 'wrong', 'mistake',
  'error', 'fault', 'blame', 'guilt', 'shame', 'regret',

  // Betrayal
  'cheat', 'liar', 'fake', 'player', 'games', 'manipulate',
  'gaslight', 'deceive', 'betray', 'abandon', 'leave', 'dump',

  // Toxic traits
  'narcissist', 'sociopath', 'toxic', 'abusive', 'controlling',
  'possessive', 'obsessive', 'jealous', 'insecure', 'unstable',

  // Dismissive
  'ignore', 'disregard', 'dismiss', 'reject', 'rejecting',
  'refuse', 'refusing', 'deny', 'denying', 'discredit',

  // Hurtful words
  'hate', 'ugly', 'stupid', 'idiot', 'dumb', 'crazy',
  'psycho', 'mental', 'sick', 'twisted', 'warped', 'disturbed',

  // Negative patterns
  'play games', 'play hard to get', 'ghosting', 'disappearing',
  'hot and cold', 'mixed signals', 'confusing', 'manipulative',

  // Red flags
  'red flag', 'warning', 'danger', 'toxic', 'abuse', 'controlling',
  'possessive', 'jealous', 'doubt', 'suspicious', 'manipulate',

  // Hurtful actions
  'ignore', 'dismiss', 'reject', 'abandon', 'leave', 'dump',
  'cheat', 'lie', 'deceive', 'betray', 'hurt',

  // Negative emotions
  'angry', 'hurt', 'sad', 'depressed', 'anxious', 'worried',
  'stressed', 'overwhelmed', 'exhausted', 'drained', 'tired',

  // Toxic
  'toxic', 'abusive', 'controlling', 'possessive', 'jealous',
  'manipulative', 'gaslighting', 'narcissistic', 'sociopathic',

  // Negative
  'bad', 'wrong', 'hurtful', 'harmful', 'damaging',
  'destructive', 'toxic', 'negative', 'harmful',

  // Betrayal
  'cheat', 'liar', 'fake', 'player', 'deceiver',
  'betrayer', 'backstabber', 'two-faced', 'hypocrite',

  // Disrespect
  'disrespect', 'disregard', 'dismiss', 'ignore', 'reject',
  'deny', 'deceive', 'lie', 'manipulate',

  // Negative traits
  'narcissist', 'sociopath', 'toxic', 'abusive',
  'controlling', 'possessive', 'jealous', 'insecure',

  // Negative
  'bad', 'hurtful', 'harmful', 'damaging', 'destructive',
  'toxic', 'negative', 'wrong', 'mistake', 'error',

  // Betrayal
  'cheat', 'liar', 'fake', 'player', 'deceiver',
  'betrayer', 'backstabber', 'hypocrite',

  // Disrespect
  'disrespect', 'disregard', 'dismiss', 'ignore',
  'reject', 'deny', 'deceive', 'lie',

  // Negative traits
  'narcissist', 'sociopath', 'toxic', 'abusive',
  'controlling', 'possessive', 'jealous', 'insecure',

  // Negative
  'bad', 'hurtful', 'harmful', 'damaging', 'destructive',
  'toxic', 'negative', 'wrong', 'mistake', 'error'
];

const ENGLISH_DRY_RESPONSES = [
  'k', 'ok', 'okay', 'okey', 'cool', 'nice', 'good',
  'fine', 'sure', 'alright', 'yea', 'yeah', 'nah', 'no',
  'lol', 'lmao', 'haha', 'hehe', 'idk', 'idc',
  'whatever', 'maybe', 'bet', 'iconic', 'slay',
  'facts', 'real', 'cap', 'no cap', 'fr', 'for real',
  'hmm', 'hm', 'hmmm', 'hmm', 'ok', 'k', 'yeah',
  'nah', 'lol', 'lmao', 'haha', 'hehe', 'idk', 'idc',
  'whatever', 'maybe', 'bet', 'ok', 'okay', 'cool', 'nice',
  'good', 'fine', 'sure', 'alright', 'yea', 'yeah', 'nah'
];

const ENGLISH_RED_FLAGS = [
  // Manipulation
  'red flag', 'gaslight', 'manipulate', 'manipulating', 'manipulative',
  'controlling', 'controlling behavior', 'possessive', 'toxic', 'narcissist',

  // Cheating signs
  'cheating', 'cheater', 'liar', 'fake', 'player', 'play games',
  'playing games', 'ghost', 'ghosting', 'disappearing',

  // Disrespect
  'disrespect', 'disrespectful', 'dismissive', 'disregarding',
  'ignoring', 'ignoring me', 'dont care', 'dont text back',

  // Control tactics
  'control', 'controlling', 'possessive', 'jealous', 'suspicious',
  'doubt', 'doubting', 'insecure', 'insecurity', 'trust issues',

  // Isolation
  'isolate', 'isolation', 'cut off', 'cut off friends',
  'dont see friends', 'dont see family', 'secretive', 'secretly',

  // Threats
  'breakup with them', 'leave them', 'run away', 'get out',
  'protect yourself', 'toxic relationship', 'abusive relationship',

  // Emotional abuse
  'emotionally unavailable', 'emotionally abusive', 'emotional vampire',
  'emotional damage', 'emotional abuse', 'gaslighting',

  // Commitment issues
  'commitment issues', 'fear of commitment', 'cant commit',
  'not ready', 'not ready for relationship', 'afraid of commitment',

  // Manipulation tactics
  'love bombing', 'breadcrumbing', 'benching', 'stashing',
  'cushioning', 'zombieing', 'haunting', 'submarining',

  // Toxic patterns
  'toxic', 'narcissistic', 'sociopathic', 'abusive',
  'controlling', 'possessive', 'jealous', 'insecure',

  // Red flag behaviors
  'red flag', 'warning signs', 'danger zone', 'toxic pattern',
  'abusive pattern', 'manipulative behavior', 'controlling behavior',

  // Disrespect
  'disrespectful', 'dismissive', 'disregarding', 'ignoring',
  'invalidating feelings', 'minimizing feelings', 'gaslighting',

  // Control
  'controlling', 'possessive', 'jealous', 'obsessive',
  'insecure', 'trust issues', 'suspicious behavior',

  // Toxic
  'toxic', 'abusive', 'manipulative', 'gaslighting',
  'narcissistic', 'sociopathic', 'emotionally unavailable',

  // Breakup indicators
  'breakup signs', 'relationship ending', 'breaking up',
  'ending it', 'over', 'done', 'finished',

  // Warning signs
  'warning', 'danger', 'red flag', 'toxic',
  'abusive', 'controlling', 'manipulative',

  // Gaslighting
  'gaslight', 'gaslighting', 'making me question reality',
  'youre crazy', 'youre overreacting', 'youre imagining things',

  // Control
  'control', 'controlling', 'possessive', 'obsessive',
  'jealous', 'suspicious', 'insecure',

  // Toxic
  'toxic', 'abusive', 'manipulative', 'gaslighting',
  'narcissistic', 'sociopathic', 'emotionally unavailable',

  // Red flags
  'red flag', 'warning', 'danger', 'toxic',
  'abusive', 'controlling', 'manipulative'
];

// ============================================================================
// DRAMATIC TITLES - EXPANDED
// ============================================================================

const DRAMATIC_TITLES = {
  high: [
    '🔥 POWER COUPLE - You Two Are Literally Goals',
    '💎 SOULMATES - This Is What Love Looks Like',
    '✨ FAIRYTALE ROMANCE - Disney Level Magic',
    '👑 KING & QUEEN OF HEARTS - Unstoppable Together',
    '💕 PERFECT MATCH - Written In The Stars',
    '🌟 DESTINY - You Were Meant For Each Other',
    '❤️ PURE LOVE - Rare And Beautiful Connection',
    '💫 MAGIC - This Love Is One In A Million',
    '🎯 THE REAL DEAL - True Love Found',
    '🌹 ROMANCE NOVEL Material - Better Than Fiction',
    '💝 FOREVER TOGETHER - Eternity Written',
    '👩 BRIDAL VIBES - Wedding In Future',
    '💐 FLOWER BLOSSOMING - Love In Full Bloom',
    '🌊 OCEAN DEEP - Endless Love',
    '🌠 UNIVERSE - Your Love Is The Cosmos',
    '⭐ STARS ALIGN - Cosmic Connection',
    '💖 HEART CONNECTION - Soul To Soul',
    '🦋 ETERNAL FLAME - Burning Forever',
    '💝 LOCKED HEARTS - Forever Together'
  ],
  medium_high: [
    '💜 SOMETHING SPECIAL - Give It A Real Chance',
    '🌟 PROMISING - This Could Be Something Beautiful',
    '💕 STRONG CONNECTION - Foundation For Love',
    '✨ GOOD VIBES - Definitely Keep Exploring',
    '🎯 WORTH IT - Potential For Something Amazing',
    '💫 SPARKS FLYING - Chemistry Is Real',
    '🌈 HOPEFUL - Bright Future Possibilities',
    '❤️ GROWING - Getting Stronger Every Day',
    '💛 SUNNY SIDE - Looking Bright',
    '🌱 GROWING TOGETHER - Building Something Real',
    '🎭 UNFOLDING - Story Is Beginning',
    '🌺 NEW CHAPTER - Writing Together',
    '💎 GEM FOUND - Rare Connection',
    '🔮 MAGIC IN MAKING - Watch This Space',
    '🌟 RISING STAR - Bright Future',
    '💕 BLOSSOMING - Love Developing',
    '🎯 ON RIGHT TRACK - Keep Going',
    '✨ SOMETHING REAL - Not Just Infatuation'
  ],
  medium: [
    '🤔 SITUATIONSHIP - Define It Or Leave It',
    '💔 COMPROMISE - Are You Settling For Less?',
    '😐 FRIENDZONE TERRITORY - Or Something More?',
    '🎭 IT\'S COMPLICATED - Figure It Out Fast',
    '⚖️ ONE-SIDED - You\'re Doing All The Work',
    '🌪 CONFUSING - Mixed Signals Everywhere',
    '💭 MAYBE LOVE - Maybe Just Comfort',
    '❓ UNCERTAIN - Needs Clear Communication',
    '🌊 WAVY - Up And Down',
    '🎭 PLAYING IT COOL - Who Knows',
    '💤 GRAY AREA - Not Clear',
    '😶 SILENT TREATMENT - Not Talking',
    '🔄 ON AND OFF - Hot Then Cold',
    '📱 TEXT ONLY - No Real Effort',
    '🎪 UNCLEAR - Define Or Leave',
    '💭 THINKING TOO MUCH - Overanalyzing',
    '😐 WAITING GAME - Not Moving Forward',
    '💔 SETTLING - Accepting Less'
  ],
  low: [
    '⚠️ WAKE UP - This Is Not Love',
    '💀 EMOTIONAL DAMAGE - Run, Don\'t Walk',
    '🚩 RED FLAG PARADE - Every Single One',
    '💔 WASTING TIME - You Deserve Better',
    '🎭 FAKE LOVE - They\'re Playing Games',
    '☠️ TOXIC TO THE CORE - Get Out Now',
    '📉 FADING FAST - Save Your Dignity',
    '😢 BREAKUP IMMINENT - Prepare Your Heart',
    '🚨 DANGER ZONE - Toxic Territory',
    '💔 ONE SIDED EFFORT - You\'re Being Used',
    '😈 EMOTIONAL VAMPIRE - Draining You',
    '🚫 NOT GOING ANYWHERE - Dead End',
    '💔 SINKING SHIP - Get To Safety',
    '⛔ DOOMED FROM START - Never Had Chance',
    '💀 SOUL CRUSHING - Killing You Slowly',
    '🚩 RED FLAG TSUNAMI - Overwhelming',
    '😢 HEART BREAKING - Pain Incoming',
    '🔚 GAME OVER - Time To Move On'
  ],
  critical: [
    '☠️ BREAK UP NOW - Seriously, LEAVE',
    '💔 HE\'S FOOLING YOU - Don\'t Fall For It',
    '🚪 WALK AWAY - Door Is Open, Use It',
    '😈 HE\'S USING YOU - Wake Up Sister',
    '🚩 HE\'S PLAYING YOU - You\'re Being Played',
    '⚠️ TOXIC MANIPULATOR - Master Gaslighter',
    '💀 DANGEROUS TOXIC - Protect Yourself Now',
    '🔥 BURN THIS - Delete Everything Now',
    '💔 HE DOESN\'T CARE - And Never Will',
    '🚩 RED FLAG FACTORY - Mass Production',
    '😈 MASTER PLAYER - Professional Manipulator',
    '💔 EMOTIONAL ABUSE - This Is Toxic',
    '🚪 RUN FOR YOUR LIFE - Seriously Leave',
    '☠️ HEART DESTROYER - Toxic Nuclear',
    '💔 GASLIGHTING CHAMPION - World Class',
    '🚩 TOXIC WASTE - Every Red Flag',
    '😈 USING YOUR FEELINGS - Emotional Vampire',
    '💀 DESTROYING YOUR SOUL - Get Out Now',
    '🔥 EMERGENCY EXIT - Leave Immediately',
    '💔 HE DOESN\'T LOVE YOU - Wake Up',
    '🚩 NARCISSIST HEAVEN - Run Away',
    '😈 SOCIOPATH IN DISGUISE - Danger',
    '💔 DEAD END RELATIONSHIP - No Future',
    '☠️ TOXIC NIGHTMARE - Wake Up Now',
    '🔥 DELETE BLOCK REMOVE - Cut All Ties',
    '💔 HE\'S A MONSTER - Toxic Person',
    '🚩 EVERY RED FLAG - Complete Disaster',
    '😈 PLAYING WITH YOUR HEART - Cruel Game',
    '💀 RELATIONSHIP GRAVEYARD - Buried Alive',
    '🔥 NUCLEAR OPTION - Delete Everything'
  ]
};

// BANGLISH TITLES
const BANGLISH_TITLES = {
  high: [
    '🔥 JODI PAIR - Tomar Duijon Ekdom Perfect!',
    '💎 MORTA - Shotti Prem Ekhon Dekhachi',
    '✨ SAPNO PURNO - Sapno Meliye Geche',
    '💕 JIBON SATHI - Sobar Age Tumi',
    '❤️ SHUDDHO PREM - Rare Love Ei Duniyate',
    '💫 KI BOLBO - Kotha Bolar Nai!',
    '🌟 BHAGGO LEKHA - Tomar Duijoner!',
    '💝 SHASHON PREM - Jibon Bhor Prem',
    '👑 CHIROLOVE - Shottik Jibon Bhor',
    '💐 FUL PREM - Premer Ful Jhoreche',
    '🌊 GAHIRER PREM - Prem Onek Gahire',
    '⭐ CHANDRER PREM - Chandrer Moto Prem',
    '💖 MONER PREM - Moner Moto Shotti Prem',
    '💝 BORONGER PREM - Boronger Moto Jura',
    '🦋 JUNOON PREM - Junooner Moto Prem'
  ],
  medium_high: [
    '💜 KICHU ACHI - Ektu Dhore Rakho',
    '🌟 ASHA - Ekhon Bhalo Kintu Hote Pare',
    '💕 CHEMISTRY - Ektu Dekhao',
    '✨ VIBES - Bhalo Lagche',
    '🎯 WORTH IT - Ekhon Try Koro',
    '💫 SPARKS - Chemistry Ektu Ache',
    '🌈 ASHA - Asha Ache',
    '❤️ GROWING - Prothome Bhalo Lagche',
    '💛 SUNNY - Din Bhalo Jaache',
    '🌱 GROWING - Ektu Ektu Kore Barche',
    '🎭 STARTING - Shuru Hoyeche',
    '🌺 NOTUN - Notun Kichu',
    '💎 GEM - Ekta Valo Chejeche',
    '🔮 MAGIC - Magic Hochhe'
  ],
  medium: [
    '🤔 KI BOLBO - Jani Na',
    '💔 MON KACHHE - Kintu Kichu Onek Baki',
    '😐 MON JACHHE NA - Define Kor',
    '🎭 COMPLICATED - Eta Complicated',
    '⚖️ ONE SIDED - Tumi Sab Koro',
    '🌪 CONFUSED - Kichu Bujhi Na',
    '💭 MAYBE LOVE - Maybe Prem',
    '❓ UNCERTAIN - Kichu Bujhi Na',
    '🌊 WAVY - Up Down',
    '🎭 COOL - Bujhi Na',
    '💤 GRAY - Clear Na',
    '😶 QUIET - Kono Kotha Na',
    '🔄 ON OFF - Thik Bhalo',
    '📱 TEXT ONLY - Text Kore',
    '🎪 UNCLEAR - Ki Bujhi',
    '💭 THINKING - Onek Bhalochi',
    '😐 WAITING - Thik Thakche'
  ],
  low: [
    '⚠️ JAGO EKHON - Eta Prem Nai',
    '💀 MAN BHORLO - Sotti Kore',
    '🚩 RED FLAG - Purota Flag',
    '💔 SOMAY GASE - Save Kor',
    '🎭 NAKAL - Shob Nakal',
    '☠️ TOXIC - Dur Theko',
    '📉 FADING - Fading Fast',
    '😢 BREAKUP - Breakup Hobe',
    '🚨 DANGER - Danger Zone',
    '💔 ONE SIDED - Tumi Koro',
    '😈 VAMPIRE - Emotional Drain',
    '🚫 DEAD END - No Future',
    '💔 SINKING - Sinking',
    '⛔ DOOMED - From Start',
    '💀 SOUL CRUSH - Crushing',
    '🚩 TSUNAMI - Flag Tsunami',
    '😢 HEARTBREAK - Pain',
    '🔚 GAME OVER - Over'
  ],
  critical: [
    '☠️ SESH KORO - Agei Chole Jao',
    '💔 DHOKA DICHE - Mano Na',
    '🚪 CHOLE JAO - Dur Theko',
    '😈 BAKA BANAY FELCHE - Pagal Hobe',
    '🚩 FOOLING - Shob Nakal',
    '⚠️ TOXIC - Dur Theko',
    '💀 PROBLEM SOTTAY - Save Yourself',
    '🔥 DELETE KORO - Delete Kor',
    '💔 KEU NA - Keo Nai',
    '🚩 FLAG FACTORY - Purota Flag',
    '😈 PLAYER - Professional',
    '💔 ABUSE - Toxic',
    '🚪 BHAGAO - Seriously Leave',
    '☠️ HEART DESTROY - Nuclear',
    '💔 GASLIGHT - Champion',
    '🚩 TOXIC WASTE - Every Flag',
    '😈 USING - Emotional Vampire',
    '💀 DESTROY - Get Out',
    '🔥 EMERGENCY - Leave Now',
    '💔 NO LOVE - Wake Up',
    '🚩 NARCISSIST - Run Away',
    '😈 SOCIOPATH - Danger',
    '💔 DEAD END - No Future',
    '☠️ NIGHTMARE - Wake Up',
    '🔥 DELETE BLOCK - Delete All',
    '💔 MONSTER - Toxic Person',
    '🚩 EVERY FLAG - Disaster',
    '😈 PLAYING - Cruel Game',
    '💀 GRAVEYARD - Buried',
    '🔥 NUCLEAR - Delete Everything'
  ]
};

// ============================================================================
// DRAMATIC INSIGHTS
// ============================================================================

const DRAMATIC_INSIGHTS = {
  high: [
    'This isn\'t just love - it\'s kind of connection people write books about.',
    'They\'re not just your partner - they\'re your best friend, your biggest supporter, your everything.',
    'The way you talk to each other shows deep emotional maturity and genuine affection.',
    'You\'ve found something rare - protect this love with everything you have.',
    'Your communication style shows mutual respect and understanding. This is a real deal.',
    'This is what fairytales are made of - pure, authentic, magical connection.',
    'Every message shows care, every response shows love, every moment matters.',
    'You two have a chemistry that can\'t be faked. This is destiny at work.',
    'The way you support each other is beautiful. This is genuine partnership.',
    'Your love story is being written in real time, and it\'s absolutely beautiful.'
  ],
  medium_high: [
    'There\'s something real here - nurture it, communicate openly, and watch it grow.',
    'You\'ve got a strong foundation - keep building with honesty and vulnerability.',
    'The potential is undeniable - both of you are invested in making this work.',
    'This feels genuine - don\'t let fear or overthinking ruin something beautiful.',
    'Keep going - you\'re on right path to something special.',
    'Don\'t overthink it - the feelings are real, the connection is genuine.',
    'Take the leap of faith - this could be something life-changing.',
    'Both of you are showing up. Keep that energy going.',
    'Trust what you\'re feeling - sometimes love starts as friendship.',
    'Your instincts are right about this one. Follow your heart.'
  ],
  medium: [
    'One of you is more invested than the other - that\'s a recipe for heartbreak.',
    'You\'re in that gray area where neither of you knows what this is. Define it.',
    'The chemistry is there but the commitment is shaky. Decide what you want.',
    'You\'re catching feelings but the other person might just be having fun.',
    'Time to have that scary conversation - where is this actually going?',
    'Stop settling for half measures - you deserve full commitment or nothing.',
    'If it\'s not clear, maybe it\'s not meant to be. Know when to walk away.',
    'Confusion is not a foundation. Get clarity or move on.',
    'Mixed signals mean mixed feelings. Don\'t make up excuses for them.',
    'You deserve someone who knows what they want. Not someone figuring it out.'
  ],
  low: [
    'They\'re keeping their options open while you\'re already planning the wedding. Wake up.',
    'Every dry response is another sign that they\'re just not that into you.',
    'You\'re giving 100% while they\'re barely giving 20%. That\'s not love, that\'s charity.',
    'The red flags aren\'t just waving - they\'re screaming at you.',
    'You\'re more invested in the fantasy than reality. Face the truth.',
    'If they wanted to, they would. Actions speak louder than texts.',
    'You\'re being emotionally played. Recognize the game and stop playing.',
    'This is wasting your time and your feelings. You deserve better.',
    'The inconsistency tells you everything you need to know. Believe it.',
    'You\'re holding onto hope that they\'re not giving you any reason to have.',
    'Stop making excuses for behavior that you wouldn\'t accept from anyone else.',
    'The red flags are not suggestions - they\'re warnings. Listen to them.',
    'You deserve someone who chooses you every day, not just when it\'s convenient.',
    'This situation is draining you more than it\'s fulfilling you. Notice that.',
    'If you have to convince yourself it\'s good, it\'s probably not.',
    'Love doesn\'t require you to lower your standards. Raise them instead.',
    'The lack of effort shows their lack of interest. Accept it and move on.',
    'You\'re being kept on the hook while they explore other options. Break free.',
    'Stop settling for breadcrumbs when you deserve the whole loaf of bread.'
  ],
  critical: [
    'This person is literally breaking you with their inconsistency. Break up with him NOW.',
    'Those sweet words are just bait to keep you on the hook. Don\'t fall for it anymore.',
    'He\'s fooling you with his charming words while showing zero real commitment. Wake up!',
    'You\'re being emotionally manipulated. This is toxic and dangerous. RUN.',
    'Every instinct you have about this being wrong is CORRECT. Trust yourself and leave.',
    'Stop making excuses for someone who doesn\'t even respect you enough to be consistent.',
    'Sweet words mean nothing when actions show zero respect. He\'s using you. DELETE HIM.',
    'This isn\'t complicated - he just doesn\'t care. That\'s the hard truth you need to hear.',
    'The drama isn\'t a sign of passion - it\'s a sign of toxicity. Get out while you can.',
    'You\'re not "fixing" anything. You\'re being emotionally drained. LEAVE HIM NOW.',
    'Those romantic texts mean nothing when he treats you like an option. You deserve better.',
    'He\'s not "complicated" - he\'s emotionally unavailable and doesn\'t want to change.',
    'Stop making excuses for his behavior. His behavior speaks louder than his empty promises.',
    'You\'re being love-bombed and then love-starved. Classic manipulator tactic. Run.',
    'If he makes you feel crazy for having normal feelings, he\'s gaslighting you. LEAVE.',
    'The red flags aren\'t just waving - they\'re setting off emergency sirens. Evacuate now.',
    'You\'re being emotionally abused. This is not normal. This is not love. This is danger.',
    'He\'s playing you like a fiddle while you\'re thinking it\'s a symphony. Wake up.',
    'Every time you give him another chance, he learns he can get away with it. Stop.',
    'Your friends see it. Your family sees it. Even strangers see it. Why can\'t you see it?',
    'This relationship is a slow poison. You\'re dying emotionally while thinking it\'s love.',
    'He\'s not emotionally unavailable - he\'s emotionally absent. Find someone who\'s actually there.',
    'You\'re being kept on a roster while thinking you\'re the only player. Break free now.',
    'The cycle of hope and disappointment he puts you through is abuse. Break the cycle.',
    'If you have to convince yourself to stay, you\'ve already left in your heart. Accept it.',
    'He\'s not protecting your heart - he\'s breaking it. Stop giving him the weapon.',
    'This isn\'t passionate love - it\'s toxic attachment. Know the difference and leave.',
    'Your worth is not measured by how much abuse you can tolerate. Leave and find your value.',
    'You\'re not being patient - you\'re being abused. Patience is for growth, not for pain.',
    'If he makes you feel lucky just to be treated with basic respect, that\'s not luck. Leave.',
    'This isn\'t "complicated" - it\'s toxic. And you\'re letting it destroy you.',
    'He\'s not "confused" - he\'s keeping you as backup while he looks for better options.',
    'Stop romanticizing pain. This isn\'t a beautiful struggle. It\'s just unnecessary suffering.',
    'You deserve someone who chooses you proudly, not someone who treats you like a secret.',
    'The way he treats you is how he sees you. And he\'s showing you he doesn\'t value you.',
    'This isn\'t about waiting for him to change. It\'s about accepting who he actually is and leaving.',
    'You\'re not "working on this relationship" - you\'re accepting abuse. There\'s a difference.',
    'Love doesn\'t hurt this much. If it does, it\'s not love. It\'s attachment to pain.',
    'They\'re not emotionally damaged - they\'re emotionally damaging. Stop trying to fix them and save yourself.',
    'Every red flag you\'re ignoring is a brick in the wall they\'re building around you. Climb out now.',
    'You\'re not being understanding - you\'re being abused. Understanding is for mistakes, not for abuse.',
    'If your friends and family all say the same thing about them, they\'re not all wrong. They are.',
    'This relationship is draining you of your light, your energy, your self-worth. Leave before you\'re empty.',
    'You\'re not holding onto love - you\'re holding onto the hope of who they could be. They\'re not that person.',
    'The fact that you\'re even questioning if this is toxic means it IS toxic. Trust that feeling.',
    'They\'re not "going through things" - they\'re going through YOU. Don\'t be their therapy.',
    'This isn\'t about communication issues - it\'s about their character issues. Character doesn\'t change.',
    'You\'re not being too demanding - you\'re demanding basic human decency. That\'s not too much to ask.',
    'Love shouldn\'t be this hard. And if it is, it\'s not the right love. Leave and find the right one.',
    'They\'re not emotionally unavailable - they\'re emotionally selfish. They take what you give and give nothing.',
    'You\'re not being patient - you\'re being used. Patience waits for growth; being used waits for replacement.',
    'If they make you feel like you\'re constantly doing something wrong, that\'s emotional abuse. Leave immediately.',
    'This relationship isn\'t a journey - it\'s a trap. And you walked in willingly. Walk out now.',
    'The time you\'re investing in them is time you\'re stealing from your future self. Stop.',
    'You\'re not "working through issues" - you\'re enduring abuse. There\'s a huge difference.',
    'They\'re not protecting your feelings - they\'re protecting their own ego at your expense. Notice that.',
    'This isn\'t a complicated love story - it\'s a simple case of someone not valuing you. Accept it.',
    'Every excuse you make for them is another brick in the prison you\'re building for yourself. Stop building.',
    'You deserve someone who lights up when they see your name on their phone, not someone who ignores it.',
    'They\'re not "busy" - they\'re prioritizing other things and people over you. Every. Single. Time.',
    'This isn\'t about timing - it\'s about them not being the right person. No time will change that.',
    'You\'re not being understanding about their issues - you\'re accepting abuse. Stop accepting.',
    'If they treat you like an option, make them an option - the one you don\'t choose. Leave.',
    'Love isn\'t about how much pain you can endure. It\'s about how much joy you can create together.',
    'You\'re not being patient - you\'re being abused. Patience is for problems you\'re solving together, not abuse.',
    'They\'re not confused about what they want - they\'re very clear: they don\'t want what you\'re offering.',
    'This relationship isn\'t a test - it\'s a trap. And you\'re failing the test by staying.',
    'You\'re not holding on to love - you\'re holding on to familiarity with pain. That\'s not love.',
    'If you have to convince yourself every day that it\'s worth it, it\'s not. Deep down you know.',
    'They\'re not emotionally unavailable - they\'re emotionally absent. Completely. And they won\'t become available.',
    'The red flags aren\'t suggestions - they\'re screams. Start listening before it\'s too late.',
    'You\'re not being understanding of their flaws - you\'re accepting abuse. Flaws are for working on; abuse is for leaving.',
    'This relationship is consuming your time, energy, happiness, and self-worth. Leave before you\'re empty.',
    'They\'re not going through a phase - this is who they are. Phases end. This is permanent character.',
    'You\'re not "giving it time" - you\'re giving away your life. And they\'re not giving anything back.',
    'The fact that they don\'t see how amazing you are is their biggest failure, not yours. Stop trying to fix them.',
    'Love doesn\'t require you to shrink yourself to fit into someone\'s life. That\'s not love. That\'s disappearance.',
    'This isn\'t about communication - it\'s about respect. And they have zero for you. Every single kind.',
    'If you\'re consistently unhappy more than you\'re happy, that\'s your answer. Stop waiting for the happy to happen.',
    'They\'re not protecting your heart - they\'re protecting their ego using your emotions as weapons. Leave immediately.',
    'This isn\'t a journey - it\'s a cycle. And every cycle makes you smaller and them bigger. Break it.',
    'You\'re not being understanding - you\'re being destroyed. Understanding doesn\'t destroy. Love doesn\'t destroy. This destroys.',
    'If they made a list of everything you do wrong, that list would be blank. If you listed theirs, it would be endless. Remember that.',
    'Every moment you stay is teaching them that they can treat you however they want and you\'ll accept it. Stop teaching them that.',
    'This relationship isn\'t building you up - it\'s breaking you down piece by piece. Save what\'s left of yourself.',
    'You\'re not "trying" - you\'re trying the impossible: making someone love you who doesn\'t value you. Stop trying.',
    'They\'re not emotionally damaged - they\'re emotionally damaging. And they\'re using you as their damage control. Be done being their damage control.',
    'The way they treat you tells you everything you need to know about how they see you. Believe what they show, not what they say.',
    'This isn\'t about fixing communication - it\'s about them being fundamentally unable or unwilling to be a good partner. Leave.',
    'If your friends and family all say the same thing about them, they\'re not all wrong. They are wrong. And you\'re wrong for staying.',
    'You\'re not holding onto love - you\'re holding onto hope. And hope without evidence is just denial. Break through it.',
    'Every time you forgive them for the unforgivable, you\'re telling them their behavior is acceptable. It\'s not. Stop.',
    'This relationship is a slow death of your self-esteem, your happiness, your joy, your hope. Leave before you\'re dead inside.',
    'They\'re not going through anything - they\'re going through you. Using you up and moving on when you\'re drained. Don\'t be used.',
    'You\'re not being understanding of their "issues" - you\'re being abused. Their issues are not your responsibility to fix or endure. They\'re theirs.',
    'If you have to lower your standards to stay in this relationship, you\'re not in a relationship - you\'re in compromise. With your own worth.',
    'This isn\'t complicated - it\'s simple. They don\'t value you, you don\'t value yourself, and together you\'re creating this mess. Fix the part you control: leave.'
  ]
};

// PERSONA TYPES
const PERSONA_TYPES = {
  high: ['Hopeless Romantics', 'Power Couple', 'Soulmates', 'Dream Team', 'Love Birds', 'Perfect Match'],
  medium_high: ['Love Birds', 'Sweethearts', 'Perfect Pair', 'Growing Together', 'Hopeful Hearts'],
  medium: ['Testing Waters', 'Figuring It Out', 'Almost There', 'Work In Progress', 'Uncertain'],
  low: ['One-Sided', 'Confused Hearts', 'Misaligned', 'Wrong Direction', 'Settling'],
  critical: ['Toxic Situation', 'Breaking Point', 'Emotional Damage', 'Warning Signs', 'Danger Zone']
};

// COMMUNICATION STYLES
const COMMUNICATION_STYLES = [
  'Passionate & Expressive', 'Balanced & Respectful', 'Casual & Lighthearted',
  'Serious & Deep', 'Playful & Flirty', 'Supportive & Caring',
  'One-Sided Imbalance', 'Dry & Uninvested', 'Toxic & Manipulative',
  'Passive-Aggressive', 'Cold & Distant', 'Hot & Cold',
  'Consistent & Reliable', 'Inconsistent & Unreliable',
  'Open & Honest', 'Secretive & Evasive', 'Direct & Bold',
  'Subtle & Indirect', 'Expressive & Dramatic', 'Calm & Grounded',
  'Emotional & Intense', 'Rational & Logical', 'Spontaneous & Random'
];

// ADVICE
const ADVICE = {
  high: [
    'Keep doing what you\'re working - this is rare love',
    'Express gratitude for each other every day',
    'Plan your future together - you\'re ready',
    'Don\'t take this connection for granted',
    'Support each other\'s dreams and growth',
    'Communicate openly about everything',
    'Keep the romance alive',
    'Celebrate your connection',
    'Protect this love with everything'
  ],
  medium_high: [
    'Have deeper conversations about feelings',
    'Create shared experiences and memories',
    'Be vulnerable with each other',
    'Give each other space to grow individually',
    'Consistently show appreciation',
    'Make future plans together',
    'Show up fully in the relationship',
    'Trust what you\'re building',
    'Don\'t let fear hold you back'
  ],
  medium: [
    'Have "the talk" - define what you are',
    'Be honest about your expectations',
    'Don\'t assume - communicate clearly',
    'Match energy or walk away',
    'Trust your gut feelings',
    'Set clear boundaries',
    'Don\'t settle for less',
    'Ask direct questions',
    'Get clarity or leave'
  ],
  low: [
    'Stop making excuses for their behavior',
    'Focus on yourself and your happiness',
    'Set boundaries and stick to them',
    'Don\'t settle for breadcrumbs',
    'Prepare to walk away if things don\'t change',
    'Recognize your own worth',
    'Listen to your instincts',
    'Stop over-analyzing their mixed signals',
    'Accept that actions show true feelings',
    'Don\'t try to convince them to love you',
    'Value yourself enough to leave',
    'Stop giving more than you receive',
    'Face the reality of the situation',
    'Know when to walk away',
    'Don\'t let hope override reality',
    'Choose self-respect over attachment',
    'Recognize red flags early',
    'Learn from this experience',
    'Better alone than wrong relationship'
  ],
  critical: [
    'BLOCK THEM IMMEDIATELY - Protect your peace',
    'Cut off all contact - no exceptions',
    'Document everything if needed',
    'Surround yourself with supportive friends',
    'Take time to heal before trying again',
    'Remember: You deserve someone who chooses you',
    'Don\'t look back - look forward',
    'Learn the red flags for next time',
    'Trust that leaving is the right choice',
    'Don\'t respond to their attempts to reach out',
    'Delete all evidence of them',
    'Block them on all platforms',
    'Don\'t let your friends talk you into returning',
    'Heal properly before dating again',
    'Remember your worth every day',
    'Don\'t romanticize the toxic relationship',
    'Recognize gaslighting techniques',
    'Stand firm in your decision to leave',
    'Don\'t fall for hoovering attempts',
    'Trust that they showed you who they are - believe them',
    'You can\'t fix someone who doesn\'t want to be fixed',
    'This is not your fault - this is their character',
    'Leave immediately - don\'t wait for the "perfect time"',
    'Better to be alone than with someone who breaks you',
    'Save yourself before there\'s nothing left to save'
  ]
};

// RED FLAG MESSAGES
const RED_FLAG_MESSAGES = [
  'Love bombing - excessive affection too fast',
  'Gaslighting - making you question reality',
  'Inconsistent - hot and cold behavior',
  'Controlling - wanting to isolate you',
  'Jealous - questioning your every move',
  'Disrespectful - disregarding your feelings',
  'Secretive - hiding things from you',
  'Manipulative - guilt-tripping you',
  'Dishonest - small lies that add up',
  'Unavailable - emotionally and physically',
  'Dismissive - your feelings don\'t matter',
  'Neglecting - you\'re not a priority',
  'Isolating - cutting you off from others',
  'Possessive - excessive control over you',
  'Toxic - negative energy and behavior',
  'Abusive - emotional or physical harm',
  'Narcissistic - everything about them',
  'Sociopathic - lack of empathy',
  'Unreliable - never there when needed',
  'Manipulative - playing mind games',
  'Controlling behavior - dictating your life',
  'Emotionally unavailable - can\'t connect',
  'Dismissive of boundaries - crosses lines',
  'Inconsistent communication - hot then cold',
  'Jealous and suspicious - constant doubt',
  'Gaslighting techniques - making you doubt yourself',
  'Love bombing then withdrawing - manipulation cycle',
  'Lying and deception - not trustworthy',
  'Controlling your actions - what you do/wear/go',
  'Isolating from friends/family - separation tactic',
  'Blaming you for everything - never their fault',
  'Making you feel crazy for normal emotions',
  'Disappearing acts - ghosting behavior',
  ' breadcrumbing - giving just enough to keep you interested',
  'Benching - keeping you as backup option',
  'Stashing - hiding you from others',
  'Zombieing - returning from dead without warning',
  'Breadcrumbing - minimal effort to keep you hooked',
  'Love bombing - overwhelming affection with ulterior motives',
  'Gaslighting - denying reality and making you question yourself',
  'Projection - accusing you of what they\'re doing',
  'Triangulation - bringing others into conflicts',
  'Invalidating feelings - dismissing your emotions',
  'Moving goalposts - changing expectations constantly',
  'Stonewalling - refusing to communicate',
  'Silent treatment - punishing you with silence',
  'Guilt-tripping - making you feel bad for their actions',
  'Playing victim - never taking responsibility',
  'Love withholding - using affection as control',
  'Emotional blackmail - threatening to leave to get what they want',
  'Comparison - comparing you to others',
  'Public humiliation - embarrassing you intentionally',
  'Financial control - controlling your money',
  'Excessive jealousy - controlling who you see/talk to',
  'Monitoring behavior - tracking your every move',
  'Forced isolation - cutting you off from support system',
  'Blame shifting - never accepting responsibility',
  'DARVO tactics - deny, attack, reverse victim and offender',
  'Withholding affection - using love as punishment',
  'Unpredictable mood swings - walking on eggshells',
  'Constant criticism - nothing is ever good enough',
  'Passive-aggressive behavior - indirect hostility',
  'Emotional unavailability - unable to connect deeply'
];

// GREEN FLAG MESSAGES
const GREEN_FLAG_MESSAGES = [
  'Consistent communication - always there',
  'Respects boundaries - honors your needs',
  'Supportive growth - encourages you',
  'Apologizes sincerely - takes responsibility',
  'Makes effort - shows you matter',
  'Transparent - honest about everything',
  'Includes you - in decisions and plans',
  'Validates feelings - your emotions matter',
  'Reliable - follows through on promises',
  'Patient - understanding and kind',
  'Trustworthy - honest and dependable',
  'Encouraging - believes in you',
  'Protective - looks out for you',
  'Compromises - meets you halfway',
  'Communicates openly - no secrets',
  'Makes time for you - prioritizes the relationship',
  'Shows affection consistently - not just sometimes',
  'Listens actively - hears and understands',
  'Admits mistakes - takes responsibility',
  'Supports your goals - celebrates your wins',
  'Comforts you when upset - emotionally available',
  'Respects your independence - doesn\'t control',
  'Introduces you to friends/family - proud of you',
  'Plans future with you - includes you in vision',
  'Handles conflict maturely - no drama or toxicity',
  'Gives space when needed - respects your time',
  'Checks in on you - cares about your well-being',
  'Remembers details - shows attention',
  'Makes you feel safe - emotionally and physically',
  'Celebrates your successes - genuinely happy for you',
  'Is loyal - committed and faithful',
  'Communicates love through actions - not just words',
  'Supports your mental health - encourages self-care',
  'Accepts your flaws - loves you as you are',
  'Never compares you to others - you\'re enough',
  'Makes sacrifices willingly - gives without counting',
  'Respects your family and friends - values your connections',
  'Handles jealousy maturely - communicates insecurity',
  'Is patient with misunderstandings - works through issues',
  'Shows gratitude - appreciates what you do',
  'Maintains individual identity - not codependent',
  'Encourages your independence - wants you to thrive',
  'Handles disagreements respectfully - no personal attacks',
  'Shows consistent interest - doesn\'t play hot/cold games',
  'Takes responsibility - admits when wrong',
  'Compromises fairly - seeks solutions that work for both',
  'Values your opinion - respects your thoughts and feelings',
  'Makes you feel important - you\'re a priority'
];

export {
  BANGLISH_POSITIVE,
  BANGLISH_NEGATIVE,
  BANGLISH_DRY_RESPONSES,
  BANGLISH_RED_FLAGS,
  ENGLISH_POSITIVE,
  ENGLISH_NEGATIVE,
  ENGLISH_DRY_RESPONSES,
  ENGLISH_RED_FLAGS,
  DRAMATIC_TITLES,
  BANGLISH_TITLES,
  DRAMATIC_INSIGHTS,
  PERSONA_TYPES,
  COMMUNICATION_STYLES,
  ADVICE,
  RED_FLAG_MESSAGES,
  GREEN_FLAG_MESSAGES,
  GENDER_PRONOUNS,
  SPEAKER_PATTERNS
};
