// ===== REPLY KNOWLEDGE BASE =====
const replies = {
  torch:        'Torch on achu! Hardware access app moolama control aagum. Real app la Firebase ku command send aagum — Android app torch on pannum.',
  wifi:         'Wi-Fi Settings page ku unna kondu poren. Settings > Network > Wi-Fi. Enable/disable pannalam. Password maatha kuda idhe path.',
  bluetooth:    'Bluetooth Settings: Settings > Connected devices > Bluetooth. Pair panna idha use panna. Auto-connect devices kuda manage panna mudiyum.',
  talkback:     'TalkBack oru screen reader da! Visually impaired users ku useful. Enable: Settings > Accessibility > TalkBack > On. Double-tap use pannanum items select panna.',
  ringtone:     'Ringtone maatha: Settings > Sound & vibration > Phone ringtone > Choose tone. Save pannuna achu! Custom song kuda set panna mudiyum.',
  battery:      'Battery drain aagutha? Steps: 1) Settings > Battery > Battery saver on pannu. 2) Background apps close pannu. 3) Screen brightness reduce pannu. 4) Location off pannu when not needed.',
  screenshot:   'Screenshots enga iruku: Internal storage > DCIM > Screenshots. 340 screenshots iruku — heavy la! Clean up pannalama nu consider pannu.',
  dark:         'Dark mode: Settings > Display > Dark theme > On. Battery save aagum. Night la eyes strain kurayum. Scheduled dark mode kuda set panna mudiyum.',
  accessibility:'Accessibility la irukura features: TalkBack (screen reader), Magnification (zoom), Color correction, Voice Access, Font size adjust, Hearing aids support. Entha feature venum?',
  privacy:      'Privacy settings: App permissions, Location access, Camera/Mic access, Privacy dashboard — Settings > Privacy. Specific app permission maatha: Settings > Apps > [App name] > Permissions.',
  notification: 'Notifications manage panna: Settings > Notifications > App notifications. Per-app off panna mudiyum. Do Not Disturb: Settings > Sound > Do Not Disturb. Schedule kuda set panna mudiyum.',
  storage:      'Storage 87% full da! Clean up steps: 1) Large files delete pannu. 2) Duplicate images remove pannu. 3) Unused APKs delete pannu. Settings > Storage > Free up space — automatic suggestions varum.',
  camera:       'Camera open achu! App la direct camera open aagum. Portrait mode, Night mode, Pro mode — advanced features camera settings la irukum.',
  silent:       'Silent mode on. All sounds off. Emergency calls only work aagum. Scheduled silent mode: Settings > Sound > Do Not Disturb > Schedule.',
  sound:        'Sound settings: Settings > Sound & vibration. Idha la: Ringtone, Notification sound, Alarm sound, Media volume, Call volume, System sounds — ella control irukum.',
  display:      'Display settings: Settings > Display. Options: Brightness, Dark mode, Screen timeout, Font size, Display size, Screen saver, Refresh rate. Blue light filter kuda irukum.',
  hotspot:      'Hotspot enable: Settings > Network > Hotspot & tethering > Wi-Fi hotspot > On. Password set panna mudiyum. Data usage track panna mudiyum.',
  developer:    'Developer options: Settings > About phone > Build number la 7 times tap pannu. Developer options unlock aagum. USB debugging, Animation scale, Mock locations — advance settings irukum.',
  factory:      'Factory reset panna careful da! Ella data delete aagum. Backup first pannu: Settings > System > Backup. Reset: Settings > System > Reset > Factory data reset.',
  default:      'Command purinjuchu! Real app la Firebase moolama Android ku send aagum — phone la automatic action perform pannum. Settings guide, file access, image recognition — ella features ready.'
};

function getReply(cmd) {
  const c = cmd.toLowerCase();
  if (c.includes('torch') || c.includes('light') || c.includes('flash')) return replies.torch;
  if (c.includes('wifi') || c.includes('wi-fi') || c.includes('network')) return replies.wifi;
  if (c.includes('bluetooth')) return replies.bluetooth;
  if (c.includes('talkback') || c.includes('talk back')) return replies.talkback;
  if (c.includes('ringtone') || c.includes('ring tone')) return replies.ringtone;
  if (c.includes('battery') || c.includes('drain') || c.includes('charge')) return replies.battery;
  if (c.includes('screenshot') || c.includes('screen shot')) return replies.screenshot;
  if (c.includes('dark mode') || c.includes('dark theme')) return replies.dark;
  if (c.includes('accessibility') || c.includes('access')) return replies.accessibility;
  if (c.includes('privacy') || c.includes('permission') || c.includes('security')) return replies.privacy;
  if (c.includes('notification') || c.includes('alert') || c.includes('do not disturb')) return replies.notification;
  if (c.includes('storage') || c.includes('space') || c.includes('memory')) return replies.storage;
  if (c.includes('camera') || c.includes('photo') || c.includes('picture')) return replies.camera;
  if (c.includes('silent') || c.includes('mute') || c.includes('vibrate')) return replies.silent;
  if (c.includes('sound') || c.includes('volume') || c.includes('ringtone')) return replies.sound;
  if (c.includes('display') || c.includes('brightness') || c.includes('screen')) return replies.display;
  if (c.includes('hotspot') || c.includes('tethering')) return replies.hotspot;
  if (c.includes('developer') || c.includes('debug')) return replies.developer;
  if (c.includes('factory') || c.includes('reset') || c.includes('format')) return replies.factory;
  return replies.default;
}

// ===== CHAT FUNCTIONS =====
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMsg(text, type) {
  const area = document.getElementById('chatArea');
  const div = document.createElement('div');
  div.className = 'msg ' + type;
  div.innerHTML = `<div class="bubble">${text}</div><div class="msg-time">${getTime()}</div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function showTyping() {
  const area = document.getElementById('chatArea');
  const t = document.createElement('div');
  t.id = 'typing-indicator';
  t.className = 'typing';
  t.innerHTML = '<span></span><span></span><span></span>';
  area.appendChild(t);
  area.scrollTop = area.scrollHeight;
  return t;
}

// ===== REAL FLASHLIGHT CONTROL =====
let activeStream = null;
let activeTrack = null;

async function controlFlashlight(turnOn) {
  if (turnOn) {
    try {
      if (!activeStream) {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
      }
      activeTrack = activeStream.getVideoTracks()[0];
      
      const capabilities = activeTrack.getCapabilities();
      if (!capabilities.torch) {
        throw new Error('Torch not supported on this device/browser');
      }
      
      await activeTrack.applyConstraints({ advanced: [{ torch: true }] });
      return { success: true, msg: '✓ Real Flashlight Enabled! Phone LED should be on.' };
    } catch (err) {
      console.error(err);
      return { success: false, msg: `✗ ERROR: ${err.message}. Permission denied or device unsupported.` };
    }
  } else {
    if (activeTrack) {
      try { await activeTrack.applyConstraints({ advanced: [{ torch: false }] }); } catch (e) {}
      activeTrack.stop();
      activeTrack = null;
    }
    if (activeStream) {
      activeStream.getTracks().forEach(t => t.stop());
      activeStream = null;
    }
    return { success: true, msg: '✗ Flashlight Disabled.' };
  }
}

let pendingFileAction = null;
let relatedFiles = [];

async function sendCmd(cmd) {
  addMsg(cmd, 'user');
  const t = showTyping();
  
  const c = cmd.toLowerCase();
  let botReply = '';

  // STATE MACHINE FOR FILE SEARCH
  if (pendingFileAction) {
    if (c.includes('1') || c.includes('2') || c.includes('3')) {
       let idx = parseInt(c.match(/[1-3]/)[0]) - 1;
       let chosenFile = relatedFiles[idx];
       botReply = `📂 Opening ${chosenFile}... (System file viewer triggered)`;
       pendingFileAction = null;
    } else if (c.includes('yes') || c.includes('aama') || c.includes('open') || c.includes('ok')) {
       botReply = `📂 Opening ${relatedFiles[0]}... (System file viewer triggered)`;
       pendingFileAction = null;
    } else if (c.includes('no') || c.includes('vena') || c.includes('cancel')) {
       botReply = `👍 Okay, file open pannala.`;
       pendingFileAction = null;
    } else {
       botReply = `Onnum puriyala. 1, 2, 3 nu oru number type pannunga, illatha pacha 'No' sollunga.`;
       setTimeout(() => { t.remove(); addMsg(botReply, 'bot'); }, 900);
       return;
    }
    
    setTimeout(() => {
      t.remove();
      addMsg(botReply, 'bot');
    }, 900);
    return;
  }
  
  // SEARCH COMMAND INTERCEPT
  if (c.includes('search') || c.includes('find') || c.includes('file') || c.includes('thedi')) {
    const searchMatch = c.match(/(?:search|find|file|thedi)\s+([a-zA-Z0-9_\-\.]+)/i);
    let keyword = searchMatch ? searchMatch[1] : 'document.pdf';
    
    if (!searchMatch) {
       const words = c.split(' ');
       words.forEach(w => { if(w.includes('.')) keyword = w; });
    }
    
    let baseName = keyword.split('.')[0];
    relatedFiles = [
       baseName + '.pdf',
       baseName + '_final.docx',
       baseName + '_copy.png'
    ];
    
    pendingFileAction = baseName;
    botReply = `🔍 '${keyword}' thodarbaana files kedachiruku:<br><br>1. 📄 ${relatedFiles[0]}<br>2. 📝 ${relatedFiles[1]}<br>3. 🖼️ ${relatedFiles[2]}<br><br>Idhula yetha open pannanum? (1, 2, 3 endru type pannunga. Vendaam na 'No' sollunga)`;
    
    setTimeout(() => {
      t.remove();
      addMsg(botReply, 'bot');
    }, 900);
    return;
  }

  botReply = getReply(cmd);
  
  // Intercept Torch Command to trigger real hardware
  if (c.includes('torch') || c.includes('light') || c.includes('flash')) {
    const turnOn = !c.includes('off') && !c.includes('disable');
    const torchToggle = document.getElementById('torchT');
    if (torchToggle) torchToggle.checked = turnOn;
    
    const res = await controlFlashlight(turnOn);
    botReply = res.success ? res.msg : res.msg;
  }

  setTimeout(() => {
    t.remove();
    addMsg(botReply, 'bot');
    
    // NATIVE SETTINGS INTENT LOGIC
    let action = null;
    let name = null;
    if(c.includes('wifi')) { action = 'android.settings.WIFI_SETTINGS'; name = "Wi-Fi"; }
    else if(c.includes('bluetooth')) { action = 'android.settings.BLUETOOTH_SETTINGS'; name = "Bluetooth"; }
    else if(c.includes('battery')) { action = 'android.settings.BATTERY_SAVER_SETTINGS'; name = "Battery"; }
    else if(c.includes('sound') || c.includes('ringtone')) { action = 'android.settings.SOUND_SETTINGS'; name = "Sound/Ringtone"; }
    else if(c.includes('storage')) { action = 'android.settings.INTERNAL_STORAGE_SETTINGS'; name = "Storage"; }
    else if(c.includes('camera')) { action = 'android.media.action.STILL_IMAGE_CAMERA'; name = "Camera"; }
    else if(c.includes('access')) { action = 'android.settings.ACCESSIBILITY_SETTINGS'; name = "Accessibility"; }
    else if(c.includes('dark') || c.includes('display')) { action = 'android.settings.DISPLAY_SETTINGS'; name = "Display"; }
    else if(c.includes('privacy')) { action = 'android.settings.PRIVACY_SETTINGS'; name = "Privacy"; }
    else if(c.includes('notification')) { action = 'android.settings.APP_NOTIFICATION_SETTINGS'; name = "Notifications"; }

    if (action && !c.includes('torch')) {
      setTimeout(() => {
        let allowed = confirm(`SmartMobile AI wants to access your device ${name} settings.\n\nAllow Permission?`);
        if(allowed) {
           window.location.href = "intent:#Intent;action=" + action + ";end";
        }
      }, 500);
    }
  }, 900);
}

function sendMessage() {
  const inp = document.getElementById('chatInput');
  const val = inp.value.trim();
  if (!val) return;
  inp.value = '';
  sendCmd(val);
}

// ===== TOGGLE HANDLER =====
async function handleToggle(type, on) {
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  addMsg(label + ' ' + (on ? 'on' : 'off') + ' panninen.', 'user');
  const t = showTyping();
  
  let botReply = '';
  if (type === 'torch') {
    const res = await controlFlashlight(on);
    botReply = res.msg;
  } else {
    const icon = on ? '✓' : '✗';
    botReply = `${icon} ${label} ${on ? 'enabled! Real app la phone la immediately reflect aagum.' : 'disabled.'}`;
  }

  setTimeout(() => {
    t.remove();
    addMsg(botReply, 'bot');
    
    // NATIVE TOGGLE INTENT LOGIC
    let action = null;
    let name = null;
    if(type === 'wifi') { action = 'android.settings.WIFI_SETTINGS'; name = "Wi-Fi"; }
    else if(type === 'bluetooth') { action = 'android.settings.BLUETOOTH_SETTINGS'; name = "Bluetooth"; }
    else if(type === 'silent') { action = 'android.settings.SOUND_SETTINGS'; name = "Sound"; }
    
    if (action && type !== 'torch') {
       setTimeout(() => {
         let allowed = confirm(`SmartMobile AI wants to access your device ${name} settings.\n\nAllow Permission?`);
         if(allowed) {
            window.location.href = "intent:#Intent;action=" + action + ";end";
         }
       }, 500);
    }
  }, 700);
}

// ===== MIC TOGGLE =====
let micOn = false;
function toggleMic() {
  micOn = !micOn;
  const btn = document.getElementById('micBtn');
  btn.classList.toggle('recording', micOn);
  if (micOn) {
    setTimeout(() => {
      micOn = false;
      btn.classList.remove('recording');
      document.getElementById('chatInput').value = 'Torch on pannu';
      document.getElementById('chatInput').focus();
    }, 2000);
  }
}

// ===== PARTICLES =====
(function spawnParticles() {
  const container = document.getElementById('particles');
  const colors = ['#378ADD', '#1D9E75', '#7F77DD'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${3 + Math.random() * 4}s;--delay:${Math.random() * 5}s;background:${colors[i % 3]};`;
    container.appendChild(p);
  }
})();

// ===== KEYBOARD SHORTCUT =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.activeElement === document.getElementById('chatInput')) {
    sendMessage();
  }
});
