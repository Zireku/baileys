import { proto } from '../../WAProto/index.js';
import { makeLibSignalRepository } from '../Signal/libsignal.js';
import { Browsers } from '../Utils/browser-utils.js';
import logger from '../Utils/logger.js';
const version = [2, 3000, 1053060988];
export const UNAUTHORIZED_CODES = [401, 403, 419];
export const BIZ_BOT_SUPPORT_PAYLOAD = '{"version":1,"is_ai_message":true,"should_upload_client_logs":false,"should_show_system_message":false,"ticket_id":"7004947587700716","citation_items":[],"ticket_locale":"us"}';
export const DEFAULT_ORIGIN = 'https://web.whatsapp.com';
export const CALL_VIDEO_PREFIX = 'https://call.whatsapp.com/video/';
export const CALL_AUDIO_PREFIX = 'https://call.whatsapp.com/voice/';
export const DONATE_URL = 'https://saweria.co/itsliaaa'; // Lia@Note 02-02-26 --- Apologies if this feels cheeky, just a fallback
export const LIBRARY_NAME = 'itsliaaa/baileys';
export const DEF_CALLBACK_PREFIX = 'CB:';
export const DEF_TAG_PREFIX = 'TAG:';
export const PHONE_CONNECTION_CB = 'CB:Pong';
export const WA_ADV_ACCOUNT_SIG_PREFIX = Buffer.from([6, 0]);
export const WA_ADV_DEVICE_SIG_PREFIX = Buffer.from([6, 1]);
export const WA_ADV_HOSTED_ACCOUNT_SIG_PREFIX = Buffer.from([6, 5]);
export const WA_ADV_HOSTED_DEVICE_SIG_PREFIX = Buffer.from([6, 6]);
export const WA_DEFAULT_EPHEMERAL = 7 * 24 * 60 * 60;
/** Status messages older than 24 hours are considered expired */
export const STATUS_EXPIRY_SECONDS = 24 * 60 * 60;
/** WA Web enforces a 14-day maximum age for placeholder resend requests */
export const PLACEHOLDER_MAX_AGE_SECONDS = 14 * 24 * 60 * 60;
export const NOISE_MODE = 'Noise_XX_25519_AESGCM_SHA256\0\0\0\0';
export const DICT_VERSION = 3;
export const KEY_BUNDLE_TYPE = Buffer.from([5]);
export const NOISE_WA_HEADER = Buffer.from([87, 65, 6, DICT_VERSION]); // last is "DICT_VERSION"
export const LEXER_REGEX = /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[\s\S]*?`)|(\b[a-zA-Z_]\w*\b)(?=\s*\()|(\b[a-zA-Z_]\w*\b)|(\b\d+(?:\.\d+)?\b)|(\s+|[^\w\s]+)/g;
/** from: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url */
export const URL_REGEX = /https:\/\/(?![^:@\/\s]+:[^:@\/\s]+@)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?/g;
export const WA_CERT_DETAILS = {
    SERIAL: 0,
    ISSUER: 'WhatsAppLongTerm1',
    PUBLIC_KEY: Buffer.from('142375574d0a587166aae71ebe516437c4a28b73e3695c6ce1f7f9545da8ee6b', 'hex')
};
export const PROCESSABLE_HISTORY_TYPES = [
    proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
    proto.HistorySync.HistorySyncType.PUSH_NAME,
    proto.HistorySync.HistorySyncType.RECENT,
    proto.HistorySync.HistorySyncType.FULL,
    proto.HistorySync.HistorySyncType.ON_DEMAND,
    proto.HistorySync.HistorySyncType.NON_BLOCKING_DATA,
    proto.HistorySync.HistorySyncType.INITIAL_STATUS_V3
];
export const DEFAULT_CACHE_TTLS = {
    SIGNAL_STORE: 5 * 60, // 5 minutes
    MSG_RETRY: 60 * 60, // 1 hour
    CALL_OFFER: 5 * 60, // 5 minutes
    USER_DEVICES: 5 * 60 // 5 minutes
};
export const DEFAULT_CONNECTION_CONFIG = {
    version: version,
    browser: Browsers.macOS('Chrome'),
    waWebSocketUrl: 'wss://web.whatsapp.com/ws/chat',
    connectTimeoutMs: 30000,
    keepAliveIntervalMs: 30000,
    keepAliveGracePeriodMs: 45000,
    logger: logger.child({ class: 'baileys' }),
    emitOwnEvents: true,
    defaultQueryTimeoutMs: 60000,
    customUploadHosts: [],
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 3,
    fireInitQueries: true,
    auth: undefined,
    markOnlineOnConnect: true,
    syncFullHistory: false, // OPTIMIZED: FORCE DISABLED
    patchMessageBeforeSending: msg => msg,
    shouldSyncHistoryMessage: msg => {
        const type = typeof msg === 'number' ? msg : msg?.syncType;
        return type === 0; // Allow INITIAL_BOOTSTRAP (0) for LID mappings, skip FULL (2) & RECENT (3)
    },
    shouldIgnoreJid: () => false,
    linkPreviewImageThumbnailWidth: 192,
    transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
    generateHighQualityLinkPreview: true,
    enableAutoSessionRecreation: false,
    enableRecentMessageCache: true,
    options: {},
    appStateMacVerification: {
        patch: false,
        snapshot: false
    },
    countryCode: 'US',
    getMessage: async () => undefined,
    cachedGroupMetadata: async () => undefined,
    makeSignalRepository: makeLibSignalRepository,
    messageHistoryMaxAgeSeconds: 600
};
export const MEDIA_PATH_MAP = {
    image: '/mms/image',
    video: '/mms/video',
    audio: '/mms/audio',
    document: '/mms/document',
    sticker: '/mms/image',
    gif: '/mms/gif',
    ptt: '/mms/ptt',
    ptv: '/mms/video',
    ppic: '/pps/photo',
    'ads-image': '/mms/ads-image',
    'ads-video': '/mms/ads-video',
    'biz-cover-photo': '/pps/biz-cover-photo',
    'group-history': '/mms/group-history',
    'md-app-state': '/mms/md-app-state',
    'md-msg-hist': '/mms/md-msg-hist',
    'music-artwork': '/mms/music-artwork',
    'product-catalog-image': '/product/image',
    'sticker-pack': '/mms/sticker-pack',
    'thumbnail-document': '/mms/thumbnail-document',
    'thumbnail-image': '/mms/thumbnail-image',
    'thumbnail-link': '/mms/thumbnail-link',
    'thumbnail-sticker-pack': '/mms/thumbnail-sticker-pack',
    'thumbnail-video': '/mms/thumbnail-video',
    'maiba-file': '/wa-ai/maiba-file'
};
// Lia@Changes 06-02-26 --- Add newsletter media path for "/m1/" instead of "/o1/" (⁠≧⁠▽⁠≦⁠)
export const NEWSLETTER_MEDIA_PATH_MAP = {
    image: '/newsletter/newsletter-image',
    video: '/newsletter/newsletter-video',
    document: '/newsletter/newsletter-document',
    audio: '/newsletter/newsletter-audio',
    sticker: '/newsletter/newsletter-sticker',
    gif: '/newsletter/newsletter-gif',
    ptt: '/newsletter/newsletter-ptt',
    ptv: '/newsletter/newsletter-ptv',
    'music-artwork': '/mms/newsletter-music-artwork',
    'sticker-pack': '/newsletter/newsletter-sticker-pack',
    'thumbnail-link': '/newsletter/newsletter-thumbnail-link',
    'waffle-image': '/mms/waffle-image',
    'waffle-video': '/mms/waffle-video'
};
export const MEDIA_HKDF_KEY_MAPPING = {
    audio: 'Audio',
    document: 'Document',
    gif: 'Video',
    history: 'History',
    image: 'Image',
    ppic: '',
    product: 'Image',
    ptt: 'Audio',
    'sticker-pack': 'Sticker Pack',
    'thumbnail-sticker-pack': 'Sticker Pack Thumbnail',
    sticker: 'Image',
    video: 'Video',
    'group-history': 'Group History',
    'ads-image': 'ads-image',
    'ads-video': 'ads-video',
    'thumbnail-document': 'Document Thumbnail',
    'thumbnail-image': 'Image Thumbnail',
    'thumbnail-video': 'Video Thumbnail',
    'thumbnail-link': 'Link Thumbnail',
    'md-msg-hist': 'History',
    'md-app-state': 'App State',
    'product-catalog-image': 'Image',
    'payment-bg-image': 'Payment Background',
    ptv: 'Video',
    'biz-cover-photo': 'Image',
    'music-artwork': 'Music Artwork',
    'maiba-file': 'Document',
    location: 'Location',
    contact: 'Contact',
    'voip-token': 'Voip Token'
};
export const MEDIA_KEYS = Object.keys(MEDIA_PATH_MAP);
/** 120s timeout for history sync stall detection, same as WA Web's handleChunkProgress / restartPausedTimer (g = 120) */
export const HISTORY_SYNC_PAUSED_TIMEOUT_MS = 120000;
export const MIN_PREKEY_COUNT = 5;
export const INITIAL_PREKEY_COUNT = 812;
export const UPLOAD_TIMEOUT = 30000; // 30 seconds
export const TimeMs = {
    Minute: 60 * 1000,
    Hour: 60 * 60 * 1000,
    Day: 24 * 60 * 60 * 1000,
    Week: 7 * 24 * 60 * 60 * 1000
};
//# sourceMappingURL=index.js.map
