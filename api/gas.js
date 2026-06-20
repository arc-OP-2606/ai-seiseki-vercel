export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const GAS_URL = 'https://script.google.com/macros/s/AKfycby4oud4_7_fobX4yMwkTpEz4IhGcezOgBB7ftRojGiTEb35Ys1USkkO4t4EvlKEIGxSWQ/exec';
  const url = new URL(GAS_URL);
  
  Object.keys(req.query).forEach(key => {
    url.searchParams.append(key, req.query[key]);
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow'
    });
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      res.status(500).json({ error: 'GASから不正なレスポンスが返りました', details: text });
      return;
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'GASとの通信に失敗しました', details: error.toString() });
  }
}
