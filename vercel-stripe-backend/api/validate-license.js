const licenses = {}; // Replace with DB later

export default function handler(req, res) {
  const { key } = req.query;

  if (!key) return res.status(400).json({ valid: false, reason: 'No key provided' });

  const license = licenses[key];

  if (!license || !license.valid) {
    return res.status(404).json({ valid: false, reason: 'Key not found or invalid' });
  }

  return res.status(200).json({ valid: true });
}
