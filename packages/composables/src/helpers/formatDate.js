const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  const d = new Date(timestamp);

  return `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
}
