document.addEventListener('DOMContentLoaded', function() {
  const codeInput = document.getElementById('code-input');
  const pasteBtn = document.getElementById('paste-btn');
  const joinBtn = document.getElementById('join-btn');
  const errorMessage = document.getElementById('error-message');
  const resultMessage = document.getElementById('result');
  const consoleTypeBtn = document.getElementById('console-type');
  const scriptTypeBtn = document.getElementById('script-type');
  
  let isConsoleType = true;
  
  const consoleRegex = /Roblox\.GameLauncher\.joinGameInstance\((\d+),\s*["']([a-zA-Z0-9-]+)["']\)/;
  const scriptRegex = /game:GetService\(["']TeleportService["']\):TeleportToPlaceInstance\((\d+),\s*["']([a-zA-Z0-9-]+)["'],/;
  
  function setCodeType(isConsole) {
    isConsoleType = isConsole;
    if (isConsole) {
      consoleTypeBtn.classList.add('active');
      scriptTypeBtn.classList.remove('active');
      codeInput.placeholder = 'Roblox.GameLauncher.joinGameInstance(123456789, "abcdef-12345-6789")';
    } else {
      consoleTypeBtn.classList.remove('active');
      scriptTypeBtn.classList.add('active');
      codeInput.placeholder = 'game:GetService("TeleportService"):TeleportToPlaceInstance(123456789, "abcdef-12345-6789", game.Players.LocalPlayer)';
    }
  }
  
  function extractParams(code) {
    let match;
    if (isConsoleType) {
      match = code.match(consoleRegex);
    } else {
      match = code.match(scriptRegex);
    }
    
    if (match && match.length >= 3) {
      return {
        placeId: match[1],
        gameInstanceId: match[2]
      };
    }
    return null;
  }
  
  function validateCode() {
    const code = codeInput.value.trim();
    const params = extractParams(code);
    
    if (!params) {
      errorMessage.style.display = 'block';
      return null;
    } else {
      errorMessage.style.display = 'none';
      return params;
    }
  }
  
  function joinServer(placeId, gameInstanceId) {
    const robloxProtocol = `roblox://placeId=${placeId}&gameInstanceId=${gameInstanceId}`;
    
    resultMessage.style.display = 'block';
    resultMessage.textContent = "Redirection vers Roblox... Cliquez sur 'Ouvrir Roblox' dans la boîte de dialogue.";
    
    window.location.href = robloxProtocol;
  }
  
  consoleTypeBtn.addEventListener('click', () => setCodeType(true));
  scriptTypeBtn.addEventListener('click', () => setCodeType(false));
  
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      codeInput.value = text;
      validateCode();
    } catch (err) {
      console.error('Erreur lors de la lecture du presse-papiers:', err);
      errorMessage.textContent = 'Impossible de lire le presse-papiers. Veuillez vérifier les permissions.';
      errorMessage.style.display = 'block';
    }
  });
  
  joinBtn.addEventListener('click', () => {
    const params = validateCode();
    if (params) {
      joinServer(params.placeId, params.gameInstanceId);
    }
  });
  
  codeInput.addEventListener('input', validateCode);
  
  setCodeType(true);
});