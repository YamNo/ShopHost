

document.addEventListener("DOMContentLoaded", async () => {
    // Basic terminal interaction (for show)
    const logContainer = document.querySelector('.panel-body');
    
    setInterval(() => {
        const lines = logContainer.querySelectorAll('p');
        const lastLine = lines[lines.length - 1];
        if(lastLine && lastLine.innerText.includes('running!')) {
            if(!lastLine.querySelector('.cursor')) {
                lastLine.innerHTML += '<span class="cursor" style="opacity:1; margin-left:5px;">_</span>';
            } else {
                const cursor = lastLine.querySelector('.cursor');
                cursor.style.opacity = cursor.style.opacity === '1' ? '0' : '1';
            }
        }
    }, 500);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Setup Modal Logic
const setupModal = document.getElementById('setupModal');
const planNameEl = document.getElementById('planName');
const planPriceEl = document.getElementById('planPrice');

// Attach click listeners to all buy buttons (except trial)
document.querySelectorAll('.btn-buy:not(.trial-btn)').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Find the parent card to extract name and price
        const card = btn.closest('.price-card');
        if (card) {
            const name = card.querySelector('h3').innerText;
            // Get price text (e.g. "Rp 4.500/bulan" -> we just want "Rp 4.500")
            const priceTag = card.querySelector('.price-tag').childNodes[0].nodeValue.trim();
            
            planNameEl.innerText = name;
            planPriceEl.innerText = priceTag;
            
            setupModal.classList.add('show');
        }
    });
});

function closeSetupModal() {
    setupModal.classList.remove('show');
}

function proceedPayment() {
    const user = document.getElementById('panelUsername').value;
    if(!user) {
        alert('Mohon isi Username Panel!');
        return;
    }
    
    // Melewati login check di versi statis HTML

    const btn = document.querySelector('.btn-purple');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    
    setTimeout(async () => {
        // Simulasi pesanan berhasil secara statis
        const randomInvoice = Math.floor(Math.random() * 90000) + 10000;
        const invoiceStr = '#INV-' + randomInvoice;
        
        document.getElementById('invoiceId').innerText = invoiceStr;
        document.getElementById('ticketPlanName').innerText = planNameEl.innerText;
        document.getElementById('ticketPlanPrice').innerText = planPriceEl.innerText;
        
        const btnDiscord = document.getElementById('btnGoDiscord');
        if (btnDiscord) {
            btnDiscord.href = "https://discord.gg/jCDbTgyfqz"; // Ganti dengan link Discord Anda
        }
        
        // Ganti URL ini dengan Discord Webhook Anda
        const WEBHOOK_URL = "https://discord.com/api/webhooks/1475858891756670977/GESfT1I1N_65i1a-BdDKr3i-WoI1Xb7_AUSvnbTHRJb8nmDSS6CVmV00AqBOVffFLqo6"; 
        
        if (WEBHOOK_URL !== "YOUR_DISCORD_WEBHOOK_URL_HERE") {
            try {
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `pesanan baru! <@816943973486559304>`,
                        embeds: [{
                            title: "🛒 Pesanan Baru Masuk!",
                            color: 7033599, // Warna hex #6b5ce5 convert ke decimal
                            fields: [
                                { name: "ID Pesanan", value: invoiceStr, inline: true },
                                { name: "Paket Dipilih", value: planNameEl.innerText, inline: true },
                                { name: "Harga", value: planPriceEl.innerText, inline: true },
                                { name: "Username Panel", value: user, inline: true },
                                { name: "Password Panel", value: document.getElementById('panelPassword').value || "*Auto-generate*", inline: true }
                            ],
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: "FahpsHost Automatic System"
                            }
                        }]
                    })
                });
            } catch (err) {
                console.error("Gagal mengirim webhook:", err);
            }
        }

        closeSetupModal();
        
        // Langsung di-redirect ke Discord
        window.open("https://discord.gg/jCDbTgyfqz", "_blank");
        
        btn.innerHTML = '<i class="fa-brands fa-discord"></i> Lanjut Pembayaran';
    }, 1500);
}

// Ticket Modal Logic
const ticketModal = document.getElementById('ticketModal');

function showTicketModal() {
    ticketModal.classList.add('show');
}

function closeTicketModal() {
    ticketModal.classList.remove('show');
}

const tosModal = document.getElementById('tosModal');
const privacyModal = document.getElementById('privacyModal');
const slaModal = document.getElementById('slaModal');

// Update existing modal click listener
window.addEventListener('click', (e) => {
    if (e.target === setupModal) setupModal.classList.remove('show');
    if (e.target === ticketModal) closeTicketModal();
    if (e.target === tosModal) tosModal.classList.remove('show');
    if (e.target === privacyModal) privacyModal.classList.remove('show');
    if (e.target === slaModal) slaModal.classList.remove('show');
});
