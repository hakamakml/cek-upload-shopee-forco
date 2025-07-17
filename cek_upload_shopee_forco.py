import streamlit as st
import requests
import time
import re

def extract_ids(url):
    match = re.search(r'i\.(\d+)\.(\d+)', url)
    if match:
        return match.group(1), match.group(2)
    return None, None

def get_upload_date(shop_id, item_id):
    api_url = f"https://shopee.co.id/api/v2/item/get?itemid={item_id}&shopid={shop_id}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        timestamp = data['item']['create_time']
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(timestamp))
    return None

# Streamlit UI
st.title("Shopee Product Upload Date Checker")

url = st.text_input("Masukkan URL produk Shopee:")

if st.button("Cek Tanggal Upload"):
    shop_id, item_id = extract_ids(url)
    if shop_id and item_id:
        try:
            upload_date = get_upload_date(shop_id, item_id)
            if upload_date:
                st.success(f"📅 Produk di-upload pada: {upload_date}")
            else:
                st.error("❌ Gagal mengambil data dari Shopee.")
        except Exception as e:
            st.error(f"❌ Error: {e}")
    else:
        st.warning("⚠️ URL tidak valid. Harus mengandung format i.{shop_id}.{item_id}")