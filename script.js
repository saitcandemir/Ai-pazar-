/* ==========================================================
   GEMİNİ YAVRUSU 61 - ANA MOTOR (script.js)
   ========================================================== */

// 1. ASİYE GUARD: GÜVENLİK VE TAKİP
const AsiyeGuard = {
    init: function() {
        document.addEventListener('contextmenu', e => e.preventDefault()); // Sağ tık yasak
        document.addEventListener('keydown', e => {
            if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 73)) {
                alert("ASİYE: Güvenlik ihlali tespit edildi! İşlemleriniz loglanıyor.");
                e.preventDefault();
            }
        });
    }
};

// 2. ZEKA VE VERİ YÖNETİMİ
const YavruZeka = {
    currentKey: "", // Süper Admin tarafından enjekte edilen geçici anahtar
    krediLimit: 20,
    kullanilanKredi: 0,

    // Hibrit Yanıt Mekanizması
    yanitla: async function(soru) {
        // A. ÖNCE SENİN 100 SORULUK MÜFREDATIN (Sınırsız/Ücretsiz)
        const sabitCevap = this.mufredatKontrol(soru);
        if (sabitCevap) return sabitCevap;

        // B. SONRA ÜYENİN KENDİ VERİSİ (Sınırsız/Ücretsiz)
        const uyeCevap = this.uyeVerisiKontrol(soru);
        if (uyeCevap) return uyeCevap;

        // C. HİÇBİRİNDE YOKSA GLOBAL ZEKA (Kredili)
        return await this.globalZekayaSor(soru);
    },

    mufredatKontrol: function(soru) {
        // Burada mufredat.json'daki 100 soru taranır
        // Örnek mantık:
        if (soru.includes("ahlak")) return "Vizyonumuz: Milli ve ahlaki değerlerle güçlendirilmiş dijital gelecektir.";
        return null;
    },

    uyeVerisiKontrol: function(soru) {
        const uyeVerisi = localStorage.getItem('yavru_61_data');
        if (uyeVerisi && uyeVerisi.toLowerCase().includes(soru.toLowerCase())) {
            return "İşletme Bilgisi: " + uyeVerisi;
        }
        return null;
    },

    globalZekayaSor: async function(soru) {
        if (!this.currentKey) return "⚠️ Sistem yöneticisi bugün için Global Zeka onayı vermemiştir. Lütfen yerel verileri kullanın.";
        if (this.kullanilanKredi >= this.krediLimit) return "❌ Günlük 20 soruluk Global limitiniz dolmuştur. Yeni hak için yöneticiye başvurun.";

        try {
            // Gemini API Çağrısı
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.currentKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: soru }] }] })
            });
            const data = await response.json();
            this.kullanilanKredi++;
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            return "Bağlantı hatası: Global zekaya ulaşılamıyor.";
        }
    }
};

// 3. SÜPER ADMİN ENJEKSİYON ALICISI
window.addEventListener('message', function(event) {
    // Süper admin panelinden gelen "Key Enjekte Et" komutunu yakalar
    if (event.data.type === 'KEY_INJECTION') {
        YavruZeka.currentKey = event.data.key;
        YavruZeka.kullanilanKredi = 0; // Krediyi sıfırla
        console.log("Global Zeka Ateşlendi!");
    }
});

// Başlat
AsiyeGuard.init();