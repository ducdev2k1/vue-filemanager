export const dateTimeFormat = 'DD-MM-YYYY HH:mm';
export const dateFormat = 'DD-MM-YYYY';
export const typeUnknown = 'unknown';
export const FileExtensions = {
  VISIO: ['vsdx', 'vdw', 'vsd'],
  MSPROJECT: ['mpp', 'mppx', 'mppm', 'mpt', 'mptx', 'mptm'],
  MSPUBLISHER: ['pub', 'pubx', 'pubm'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'photo'],
  VIDEO: ['mov', 'mp4', 'avi', 'wmv', 'mkv', 'flv', 'webm'],
  AUDIO: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
  TXT: ['txt', 'rtf'],
  DOCUMENT: ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'csv', 'accdb'],
  CODE: [
    'js',
    'ts',
    'html',
    'css',
    'json',
    'xml',
    'java',
    'py',
    'php',
    'cpp',
    'cs',
    'md',
    'rb',
    'swift',
    'go',
    'rs',
    'kt',
    'm',
    'h',
    'sh',
    'bat',
    'ps1',
    'r',
    'pl',
    'lua',
    'dart',
    'scala',
    'hs',
    'jl',
    'sql',
    'yml',
    'yaml',
    'ini',
    'toml',
    'scss',
    'sass',
    'tsx',
    'jsx',
    'dockerfile',
    'asm',
    'vue',
    'tsx',
    'jsx',
    'graphql',
    'tsx',
    'vue',
  ],
  ZIP: ['zip', 'rar', 'tar', 'gz', 'bz2', '7z'],
};
export const mimeType = {
  PDF: ['application/pdf', 'text/pdf'],
  IMAGE: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/vnd.microsoft.icon',
  ],
  VIDEO: [
    'video/mp4', // MP4
    'video/x-msvideo', // AVI
    'video/x-matroska', // MKV
    'video/webm', // WebM
    'video/ogg', // Ogg
    'video/quicktime', // MOV
    'audio/mpeg', // MP3
    'application/mp4', // MP4 Container
    'audio/ogg', // Ogg Audio
    'audio/wav', // WAV Audio
    'audio/x-wav', // WAV Audio (alternative MIME type)
    'audio/flac', // FLAC
    'audio/aac', // AAC Audio
    'audio/x-aac', // AAC Audio (alternative MIME type)
    'audio/webm', // WebM Audio
    'audio/x-matroska', // MKV Audio
    'video/x-flv', // FLV
    'application/x-mpegURL', // HLS (HTTP Live Streaming)
    'video/mp2t', // MPEG-TS
    'video/3gpp', // 3GPP
    'video/3gpp2', // 3GPP2
    'audio/amr', // AMR Audio
    'audio/x-ms-wma', // WMA Audio
    'video/x-ms-wmv', // WMV
  ],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-ms-wma', 'audio/x-aac'],
  TEXT_CODE: [
    'application/csv', // .csv
    'application/dart', // .dart
    'application/graphql', // .graphql
    'application/html', // .html
    'application/javascript', // .js
    'application/json', // .json
    'application/sql', // .sql
    'application/toml', // .toml
    'application/typescript', // .ts
    'application/vnd.dart', // .dart
    'application/x-bat', // .bat
    'application/x-httpd-php', // .php
    'application/x-openvpn-profile', // .ovpn
    'application/x-powershell', // .ps1
    'application/x-sh', // .sh
    'application/x-sql', // .sql
    'application/xml', // .xml
    'text/css', // .css
    'text/html', // .html, .htm
    'text/javascript', // .js
    'text/jsx', // .jsx
    'text/markdown', // .md
    'text/plain', // .txt, .ini
    'text/rust', // .rs
    'text/tab-separated-values', // .tsv
    'text/typescript-jsx', // .tsx
    'text/x-asm', // .asm
    'text/x-c', // .h, .c
    'text/x-c++src', // .cpp, .cxx
    'text/x-csharp', // .cs
    'text/x-dockerfile', // Dockerfile
    'text/x-go', // .go
    'text/x-haskell', // .hs
    'text/x-java-source', // .java
    'text/x-julia', // .jl
    'text/x-kotlin', // .kt, .kts
    'text/x-lua', // .lua
    'text/x-objectivec', // .m
    'text/x-perl', // .pl
    'text/x-python', // .py
    'text/x-r', // .r
    'text/x-ruby', // .rb
    'text/x-sass', // .sass
    'text/x-scala', // .scala
    'text/x-scss', // .scss
    'text/x-swift', // .swift
    'text/x-vue', // .vue
    'text/xml', // .xml
    'text/yaml', // .yml, .yaml
    'unknown',
  ],
  OFFICE: [
    ...FileExtensions.DOCUMENT,
    ...FileExtensions.VISIO,
    ...FileExtensions.MSPROJECT,
    ...FileExtensions.MSPUBLISHER,
  ],
};

// width breakpoint
export const breakPoint = {
  brSmallPc: 1279, // 1279px
  brTablet: 1199, // 1199px
  brSpLandscape: 767, // 767px
};
