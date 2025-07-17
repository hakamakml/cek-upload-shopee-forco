function convertTimestampToDate(ts) {
  const date = new Date(ts * 1000);
  return date.toLocaleString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    weekday: 'long', hour: '2-digit', minute: '2-digit'
  });
}

function insertDatePopup(text) {
  let el = document.getElementById('upload-date-info');
  if (!el) {
    el = document.createElement('div');
    el.id = 'upload-date-info';
    Object.assign(el.style, {
      position: 'fixed', bottom: '20px', left: '20px',
      background: '#fff5d1', padding: '12px', border: '1px solid #ddd',
      borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      fontFamily: 'Arial, sans-serif', zIndex: 9999
    });
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <div>${text}</div>
    <button id="refresh-ctime-btn" style="
      margin-top: 8px; padding: 6px 12px;
      background: #ff5722; color: #fff; border:none;
      border-radius:4px; cursor:pointer;
    ">🔄 Refresh Tanggal</button>`;
  document.getElementById('refresh-ctime-btn').onclick = fetchData
}

async function fetchData() {
  const match = window.location.pathname.match(/-i\.(\d+)\.(\d+)/);
  if (!match) {
    insertDatePopup('❌ Format URL tidak dikenali');
    return;
  }
  const shopid = match[1], itemid = match[2];
  insertDatePopup('🔄 Mengambil tanggal...');

  try {
    const res = await fetch(`https://shopee.co.id/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`);
    const json = await res.json();
    const ctime = json?.data?.item?.ctime || json?.data?.ctime;
    if (!ctime) throw new Error('ctime tidak ada');
    const dateStr = convertTimestampToDate(ctime);
    insertDatePopup(`📅 Upload: ${dateStr}<br><span style="font-size:12px;color:#555">ctime: ${ctime}</span>`);
  } catch (e) {
    insertDatePopup(`❌ Gagal ambil data: ${e.message}`);
  }
}

window.addEventListener('load', fetchData);