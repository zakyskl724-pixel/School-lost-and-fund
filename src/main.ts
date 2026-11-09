// 1. Tipe Data
type ClaimStatus = 'Belum Diklaim' | 'Sedang Diproses' | 'Sudah Diklaim';

interface LostItem {
  id: string;
  name: string;
  category: string;
  location: string;
  dateFound: string;
  finderName: string;
  status: ClaimStatus;
}

// 2. Logika LocalStorage
const KEY = 'LOST_AND_FOUND_DATA_V3';

function getItems(): LostItem[] {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

function addItem(item: Omit<LostItem, 'id'>): void {
  const items = getItems();
  items.push({ ...item, id: Date.now().toString() });
  localStorage.setItem(KEY, JSON.stringify(items));
}

function updateItemStatus(id: string, status: ClaimStatus): void {
  const items = getItems();
  const target = items.find(i => i.id === id);
  if (target) {
    target.status = status;
    localStorage.setItem(KEY, JSON.stringify(items));
  }
}

function deleteItem(id: string): void {
  const items = getItems();
  const filtered = items.filter(i => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(filtered));
}

// 3. Tampilan & Event Handler
const btnTambah = document.getElementById('btn-tambah');
const list = document.getElementById('list') as HTMLDivElement;
const search = document.getElementById('search') as HTMLInputElement;
const filter = document.getElementById('filter') as HTMLSelectElement;

function render() {
  const items = getItems();
  const kw = search && search.value ? search.value.toLowerCase() : '';
  const st = filter && filter.value ? filter.value : 'ALL';

  const filtered = items.filter(i => {
    const nameMatch = i.name ? i.name.toLowerCase().includes(kw) : false;
    const locMatch = i.location ? i.location.toLowerCase().includes(kw) : false;
    return (nameMatch || locMatch) && (st === 'ALL' || i.status === st);
  });

  const totalEl = document.getElementById('total');
  const unclaimedEl = document.getElementById('unclaimed');
  if (totalEl) totalEl.textContent = items.length.toString();
  if (unclaimedEl) unclaimedEl.textContent = items.filter(i => i.status === 'Belum Diklaim').length.toString();

  if (!list) return;
  
  if (filtered.length === 0) {
    list.innerHTML = '<p style="padding: 15px; text-align: center; color: #666; background: #fff; margin-top: 10px; border-radius: 5px;">Belum ada data barang temuan.</p>';
    return;
  }

  let html = '';
  for (let i = 0; i < filtered.length; i++) {
    const item = filtered[i];
    const sel1 = item.status === 'Belum Diklaim' ? 'selected' : '';
    const sel2 = item.status === 'Sedang Diproses' ? 'selected' : '';
    const sel3 = item.status === 'Sudah Diklaim' ? 'selected' : '';

    html += '<div style="border: 1px solid #ccc; padding: 12px; margin-top: 10px; border-radius: 6px; background: #fff;">';
    html += '<h3 style="margin: 0 0 5px 0;">' + item.name + ' <span style="font-size: 13px; color: #2563eb;">(' + item.category + ')</span></h3>';
    html += '<p style="margin: 3px 0; font-size: 14px; color: #444;">Lokasi: <b>' + item.location + '</b> | Penemu: <b>' + item.finderName + '</b></p>';
    html += '<p style="margin: 3px 0; font-size: 14px; color: #444;">Tanggal: ' + item.dateFound + '</p>';
    html += '<div style="margin-top: 10px; display: flex; gap: 8px; align-items: center;">';
    html += '<select class="change-status" data-id="' + item.id + '" style="padding: 5px;">';
    html += '<option value="Belum Diklaim" ' + sel1 + '>Belum Diklaim</option>';
    html += '<option value="Sedang Diproses" ' + sel2 + '>Sedang Diproses</option>';
    html += '<option value="Sudah Diklaim" ' + sel3 + '>Sudah Diklaim</option>';
    html += '</select>';
    html += '<button class="btn-del" data-id="' + item.id + '" style="background: #ef4444; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>';
    html += '</div>';
    html += '</div>';
  }

  list.innerHTML = html;
}

if (btnTambah) {
  btnTambah.addEventListener('click', () => {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const categoryInput = document.getElementById('category') as HTMLInputElement;
    const locationInput = document.getElementById('location') as HTMLInputElement;
    const dateFoundInput = document.getElementById('dateFound') as HTMLInputElement;
    const finderNameInput = document.getElementById('finderName') as HTMLInputElement;

    if (!nameInput.value || !categoryInput.value || !locationInput.value || !dateFoundInput.value || !finderNameInput.value) {
      alert('Semua kolom wajib diisi dulu!');
      return;
    }

    addItem({
      name: nameInput.value,
      category: categoryInput.value,
      location: locationInput.value,
      dateFound: dateFoundInput.value,
      finderName: finderNameInput.value,
      status: 'Belum Diklaim'
    });

    nameInput.value = '';
    categoryInput.value = '';
    locationInput.value = '';
    dateFoundInput.value = '';
    finderNameInput.value = '';

    render();
  });
}

if (list) {
  list.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('btn-del')) {
      const id = target.getAttribute('data-id');
      if (id) {
        deleteItem(id);
        render();
      }
    }
  });

  list.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    if (target.classList.contains('change-status')) {
      const id = target.getAttribute('data-id');
      const val = target.value as ClaimStatus;
      if (id) {
        updateItemStatus(id, val);
        render();
      }
    }
  });
}

if (search) search.addEventListener('input', render);
if (filter) filter.addEventListener('change', render);

render();