module.exports = (req, res) => {
  const raw = process.env.ZAZEN_EDIT ||
              process.env['zazen-edit'] ||
              process.env.zazen_edit ||
              process.env.NEXT_PUBLIC_ZAZEN_EDIT ||
              process.env.VITE_ZAZEN_EDIT || '';

  const isEdit = ['true', '1', 'yes', 'on', 'enabled'].includes(String(raw).trim().toLowerCase());

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  res.status(200).json({
    edit: isEdit,
    isEdit: isEdit,
    timestamp: Date.now()
  });
};
