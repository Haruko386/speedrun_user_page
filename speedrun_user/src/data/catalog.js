export const gameNames = {
  '76rqmld8': 'Hollow Knight',
  '4d7xvzr1': 'Animal Well',
  'y65r7g81': 'Hollow Knight: Silksong',
  'o1y9j9v6': 'Celeste',
  '9d3reryd': 'Hollow Knight Category Extensions',
  '4d73n317': 'Undertale',
  'pdv29k96': 'PICO PARK',
  'm1zjgy36': 'Ori and the Will of the Wisps',
  'ldej3o51': 'Among Us',
  'yd487k6e': 'Plants vs. Zombies',
  'j1ne9me1': 'Celeste Category Extensions',
  '9do8nnk1': 'Overwatch 2'
}

export const levelNames = {
  'ywe5zq7w': 'Forsaken City',
  '69z2m8g9': 'Old Site',
  'r9g4k7p9': 'Celestial Resort',
  'o9x7mxpd': 'Golden Ridge',
  '4955vm39': 'Mirror Temple',
  'rdq76n29': 'Reflection',
  '5d746x6d': 'The Summit',
  'gdr16vlw': 'Trial of the Warrior',
  'nwlp4ve9': 'Trial of the Conqueror',
  'ywemx77d': 'Trial of the Fool',
  '69znevg9': 'White Palace',
  'r9g1qop9': 'Path of Pain',
  '495lx03d': 'Pantheon of the Master',
  'o9x3rvp9': 'Pantheon of the Artist',
  'rdq54v2d': 'Pantheon of the Sage',
  '5d7zqm6w': 'Pantheon of the Knight',
  'kwj14q7w': 'Pantheon of Hallownest',
  'ldy23lkw': "King's Pass",
  '5d7q0yvw': "King's Pass NG+",
  '5d7rg8q9': 'Abyss Climb'
}

export const platformNames = {
  '8gej2n93': 'PC',
  '7vpkd93r': 'Nintendo Switch',
  'm1p3p7pd': 'PlayStation 4',
  'nzelrj6m': 'Emulator'
}

export const userNames = {
  '0jmpm0zj': 'Yihou',
  'x7617pqj': 'CYY2023',
  '8qrzvmdj': 'Remto',
  'jn9qeedx': 'huohuoUwU',
  'jpopv2k8': 'Swordow',
  '8rlvv2w8': 'Ghj14174',
  '8w060wvj': 'Lumosfan',
  'j0vo299x': 'Aribuge',
  'x36qglqx': 'HJM_GoldenTrophy',
  '8lrzd5v8': 'xiaomei',
  'x369vkqx': 'Haruko386',
  '8v23wzvj': 'Csus4',
  '8gmpy218': 'DUUScarlet',
  'x777rrqx': 'xuwuxw',
  '810ed5rx': 'wszOwO',
  'x7617pqq': 'pistachio3218'
}

export const followerDetails = {
  '0jmpm0zj': { joined: 1464355191, country: 'China' },
  'x7617pqq': { joined: 1580141239, country: 'China', pronouns: 'He/Him' },
  '8qrzvmdj': { joined: 1608390215, country: 'China' },
  'j0vo299x': { joined: 1633779261, country: 'China', pronouns: 'He/Him' },
  'j4qdm2vx': { joined: 1634968182, country: 'China', pronouns: 'He/Him' },
  'jn9qeedx': { joined: 1635056305, country: 'China', pronouns: 'He/Him' },
  'jpopv2k8': { joined: 1654081143, country: 'China', pronouns: 'He/Him' },
  '8gmpy218': { joined: 1659461953, country: 'China' },
  '8w060wvj': { joined: 1672012878, country: 'Nigeria', pronouns: 'He/Him' },
  '8rlvv2w8': { joined: 1675171963, country: 'China', pronouns: 'She/Her' },
  'x7617pqj': { joined: 1676028239, country: 'China', pronouns: 'She/Her' },
  '8v23wzvj': { joined: 1676867260, country: 'China', pronouns: 'Any/All' },
  'x36qglqx': { joined: 1691507150, country: 'China' },
  'x777rrqx': { joined: 1696325741, country: 'China', pronouns: 'Any/All, He/Him' },
  '8lrzd5v8': { joined: 1699345749, country: 'China', pronouns: 'Any/All' },
  'x369vkqx': { joined: 1708211532, country: 'Hong Kong', pronouns: 'She/Her' }
}

export const socialNetworks = [
  { id: 5, key: 'discord', label: 'Discord' },
  { id: 29, key: 'twitch', label: 'Twitch' },
  { id: 32, key: 'youtube', label: 'YouTube' },
  { id: 11, key: 'instagram', label: 'Instagram' },
  { id: 3, key: 'bilibili', label: 'Bilibili' },
  { id: 31, key: 'website', label: 'Website' }
]

export const coverUrl = (gameId) =>
  `https://www.speedrun.com/static/game/${gameId}/cover.png`

export const avatarUrl = (userId) =>
  `https://www.speedrun.com/static/user/${userId}/image.png`

export const formatDate = (timestamp) => {
  if (!timestamp) return '—'
  const date = new Date(Number(timestamp) * 1000)
  return Number.isNaN(date.getTime()) ? '—' : date.toISOString().slice(0, 10)
}

export const formatRunTime = (seconds) => {
  const value = Number(seconds)
  if (!Number.isFinite(value)) return '—'
  const totalMs = Math.round(value * 1000)
  const hours = Math.floor(totalMs / 3600000)
  const minutes = Math.floor((totalMs % 3600000) / 60000)
  const secs = Math.floor((totalMs % 60000) / 1000)
  const ms = totalMs % 1000
  const parts = []
  if (hours) parts.push(`${hours}h`)
  if (minutes || hours) parts.push(`${String(minutes).padStart(hours ? 2 : 1, '0')}m`)
  parts.push(`${String(secs).padStart(minutes || hours ? 2 : 1, '0')}s`)
  if (ms) parts.push(`${String(ms).padStart(3, '0')}ms`)
  return parts.join(' ')
}

export const ordinal = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return ''
  const mod100 = number % 100
  if (mod100 >= 11 && mod100 <= 13) return `${number}th`
  return `${number}${({ 1: 'st', 2: 'nd', 3: 'rd' })[number % 10] || 'th'}`
}

export const countryFlag = (countryCode) => {
  const code = String(countryCode || '').trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return '🌐'
  return String.fromCodePoint(...[...code].map(letter => 127397 + letter.charCodeAt(0)))
}

export const countryName = (countryCode) => {
  const code = String(countryCode || '').trim().toUpperCase()
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
  } catch (_) {
    return code || 'Unknown'
  }
}
