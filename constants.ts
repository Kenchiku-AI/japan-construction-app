// const host = 'api.kenchiku.ai';
const host = 'dev.api.kenchiku.ai';
// real device (if LAN IP address changes, run ifconfig and look for inet 192.168.x.x value)
// const host = '10.0.2.2:8000'; // simulator

export const baseUrl = `https://${host}`;
export const accessTokenStorageKey = 'access-token';
export const refreshTokenStorageKey = 'refresh-token';
export const micUsedKey = 'mic-used';
export const aiPolicyShownKey = 'ai-policy-shown';
export const bgColor1 = '#FDFDFD';
export const bgColor2 = '#F2F2F3';
export const bgColor3 = 'rgba(164, 169, 174, 0.05)';
export const buttonColor = '#4d9458';
export const fontColor1 = '#23303B';
export const fontColor2 = '#A4A9AE';
export const fontColor3 = '#54585c';
export const fontFamily = 'NotoSansJP-Regular';
export const errorColor1 = '#FF6363';
export const errorColor2 = '#FF636326';
export const inProgressColor1 = "#DEA807";
export const inProgressColor2 = "#FFD14A26";
export const doneColor1 = "#00AEFF";
export const doneColor2 = "#00AEFF26";
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const whisperModelFileName = 'ggml-base.bin';
