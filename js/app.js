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
let indexedFiles = []; // Store real filenames here

function indexFiles(files) {
  indexedFiles = Array.from(files); // Actual File objects storage
  addMsg(`✅ ${indexedFiles.length} files successfully indexed! Search ippo work aagum.`, 'bot');
}

async function sendCmd(cmd) {
  addMsg(cmd, 'user');
  const t = showTyping();
  
  const c = cmd.toLowerCase();
  let botReply = '';

  // STATE MACHINE FOR FILE SEARCH
  if (pendingFileAction) {
    const numMatch = c.match(/[1-5]/);
    if (numMatch) {
       let idx = parseInt(numMatch[0]) - 1;
       if (relatedFiles[idx]) {
         let chosenFile = relatedFiles[idx];
         botReply = `📂 Opening ${chosenFile.name}...`;
         
         // REAL OPEN LOGIC
         setTimeout(() => {
           let allowed = confirm(`SmartMobile AI: Open "${chosenFile.name}"?`);
           if(allowed) {
             const fileURL = URL.createObjectURL(chosenFile);
             window.open(fileURL, '_blank');
           }
         }, 500);

         pendingFileAction = null;
       } else {
         botReply = `Antha number-la file illaiye. 1-லிருந்து ${relatedFiles.length} வரை ஒரு நம்பர் சொல்லுங்க.`;
         setTimeout(() => { t.remove(); addMsg(botReply, 'bot'); }, 900);
         return;
       }
    } else if (c.includes('yes') || c.includes('aama') || c.includes('open') || c.includes('ok')) {
       botReply = `📂 Opening ${relatedFiles[0].name}...`;
       setTimeout(() => {
          const fileURL = URL.createObjectURL(relatedFiles[0]);
          window.open(fileURL, '_blank');
       }, 500);
       pendingFileAction = null;
    } else if (c.includes('no') || c.includes('vena') || c.includes('cancel')) {
       botReply = `👍 Okay, file open pannala.`;
       pendingFileAction = null;
    } else {
       botReply = `Onnum puriyala. 1-லிருந்து ${relatedFiles.length} வரை ஒரு நம்பர் டைப் பண்ணுங்க.`;
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
  if (c.includes('search') || c.includes('find') || c.includes('file') || c.includes('thedi') || c.includes('open')) {
    // Check if it's an APP launch request first
    const apps = ['camera', 'calculator', 'maps', 'youtube', 'whatsapp', 'phone', 'messages', 'settings'];
    let foundApp = apps.find(a => c.includes(a));
    
    if (foundApp) {
       triggerNativeSetting(foundApp);
       setTimeout(() => { t.remove(); }, 900);
       return;
    }

    if (indexedFiles.length === 0) {
      botReply = `📂 Search panna modhalla unga Storage-ah connect pannanum.<br><br><button class="chip" style="background:#1D9E75; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer;" onclick="document.getElementById('fileIndexer').click()">Connect & Index Now</button>`;
      setTimeout(() => { t.remove(); addMsg(botReply, 'bot'); }, 900);
      return;
    }

    const searchMatch = c.match(/(?:search|find|file|thedi)\s+([a-zA-Z0-9_\-\.]+)/i);
    let keyword = searchMatch ? searchMatch[1].toLowerCase() : '';
    
    if (!keyword) {
       const words = c.split(' ');
       words.forEach(w => { if(w.includes('.')) keyword = w.toLowerCase().split('.')[0]; });
    }
    
    // Privacy Filter & Matching
    const privacyWords = ['private', 'secret', 'password', 'personal', 'hidden', 'lock'];
    relatedFiles = indexedFiles.filter(f => {
       const nameLower = f.name.toLowerCase();
       const isMatch = nameLower.includes(keyword);
       const isPrivate = privacyWords.some(pw => nameLower.includes(pw));
       return isMatch && !isPrivate;
    }).slice(0, 5); // Pick top 5 related
    
    if (relatedFiles.length === 0) {
       botReply = `🔍 Sorry, '${keyword}' appadi oru file illai (illana adhu Privacy-la block aairukalam).`;
    } else {
       pendingFileAction = keyword;
       let listHTML = relatedFiles.map((f, i) => `${i+1}. ${f.name.endsWith('.pdf') ? '📄' : (f.name.match(/\.(jpg|jpeg|png)$/i) ? '🖼️' : '📁')} ${f.name}`).join('<br>');
       botReply = `🔍 '${keyword}' thodarbaana files kedachiruku:<br><br>${listHTML}<br><br>Idhula yetha open pannanum? (Number type pannunga or type No)`;
    }
    
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
    triggerNativeSetting(c);
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
    triggerNativeSetting(type);
  }, 700);
}

// ===== PLATFORM SPECIFIC DEEP LINKS =====
function triggerNativeSetting(keyword) {
  if (keyword.includes('torch')) return; // handled via hardware api
  
  const isWin = navigator.userAgent.toLowerCase().includes('windows');
  let actionStr = null;
  let name = null;
  
  if(keyword.includes('wifi')) { actionStr = isWin ? 'ms-settings:network-wifi' : 'intent:#Intent;action=android.settings.WIFI_SETTINGS;end'; name = "Wi-Fi"; }
  else if(keyword.includes('bluetooth')) { actionStr = isWin ? 'ms-settings:bluetooth' : 'intent:#Intent;action=android.settings.BLUETOOTH_SETTINGS;end'; name = "Bluetooth"; }
  else if(keyword.includes('battery')) { actionStr = isWin ? 'ms-settings:batterysaver' : 'intent:#Intent;action=android.settings.BATTERY_SAVER_SETTINGS;end'; name = "Battery"; }
  else if(keyword.includes('sound') || keyword.includes('ringtone') || keyword.includes('silent')) { actionStr = isWin ? 'ms-settings:sound' : 'intent:#Intent;action=android.settings.SOUND_SETTINGS;end'; name = "Sound"; }
  else if(keyword.includes('storage')) { actionStr = isWin ? 'ms-settings:storagesense' : 'intent:#Intent;action=android.settings.INTERNAL_STORAGE_SETTINGS;end'; name = "Storage"; }
  else if(keyword.includes('camera')) { actionStr = isWin ? 'microsoft.windows.camera:' : 'intent:#Intent;action=android.media.action.STILL_IMAGE_CAMERA;end'; name = "Camera"; }
  else if(keyword.includes('access')) { actionStr = isWin ? 'ms-settings:easeofaccess-narrator' : 'intent:#Intent;action=android.settings.ACCESSIBILITY_SETTINGS;end'; name = "Accessibility"; }
  else if(keyword.includes('dark') || keyword.includes('display')) { actionStr = isWin ? 'ms-settings:colors' : 'intent:#Intent;action=android.settings.DISPLAY_SETTINGS;end'; name = "Display"; }
  else if(keyword.includes('privacy')) { actionStr = isWin ? 'ms-settings:privacy' : 'intent:#Intent;action=android.settings.PRIVACY_SETTINGS;end'; name = "Privacy"; }
  else if(keyword.includes('notification')) { actionStr = isWin ? 'ms-settings:notifications' : 'intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;end'; name = "Notifications"; }
  
  // NEW APPS SUPPORT
  else if(keyword.includes('calculator')) { actionStr = isWin ? 'calculator:' : 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALCULATOR;end'; name = "Calculator"; }
  else if(keyword.includes('maps')) { actionStr = isWin ? 'bingmaps:' : 'geo:0,0?q='; name = "Maps"; }
  else if(keyword.includes('youtube')) { actionStr = 'https://www.youtube.com'; name = "YouTube"; }
  else if(keyword.includes('whatsapp')) { actionStr = 'whatsapp://send'; name = "WhatsApp"; }
  else if(keyword.includes('phone') || keyword.includes('dial')) { actionStr = 'tel:'; name = "Phone Dialer"; }
  else if(keyword.includes('msg') || keyword.includes('sms')) { actionStr = 'sms:'; name = "Messages"; }
  else if(keyword.includes('settings')) { actionStr = isWin ? 'ms-settings:general' : 'intent:#Intent;action=android.settings.SETTINGS;end'; name = "Settings"; }

  if (actionStr) {
    setTimeout(() => {
      let allowed = confirm(`SmartMobile AI wants to access your device ${name} settings.\n\nAllow Permission?`);
      if(allowed) {
         window.location.href = actionStr;
      }
    }, 500);
  }
}

// ===== MIC TOGGLE =====
// ===== MIC TOGGLE & SPEECH RECOGNITION =====
let micOn = false;
let recognition = null;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-IN'; 
  recognition.interimResults = true;

  recognition.onresult = function(event) {
    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    const inp = document.getElementById('chatInput');
    inp.value = finalTranscript || interimTranscript;
    
    if (finalTranscript) {
       setTimeout(() => { sendMessage(); }, 600);
    }
  };

  recognition.onend = function() {
    micOn = false;
    document.getElementById('micBtn').classList.remove('recording');
    document.getElementById('chatInput').placeholder = "Type or voice — Tamil/English ok...";
  };
  
  recognition.onerror = function(event) {
    console.error("Speech error", event.error);
    micOn = false;
    document.getElementById('micBtn').classList.remove('recording');
    document.getElementById('chatInput').placeholder = "Type or voice — Tamil/English ok...";
  };
}

function toggleMic() {
  if (!recognition) {
    alert("Speech Recognition not supported here. Use Chrome/Edge.");
    return;
  }
  const btn = document.getElementById('micBtn');
  if (!micOn) {
    try {
      document.getElementById('chatInput').value = '';
      document.getElementById('chatInput').placeholder = "Listening... Speak now";
      recognition.start();
      micOn = true;
      btn.classList.add('recording');
    } catch (e) { console.error(e); }
  } else {
    recognition.stop();
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
