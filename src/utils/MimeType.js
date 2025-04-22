const mimeTypeMap = {
    'txt': 'text/plaintext',
    'py': 'text/python',
    'md': 'text/markdown',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'text/json',
    'Dockerfile': 'text/bash',
    'xml': 'text/xml',
    'iml': 'text/xml',
    'gitignore': 'text/plain',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
}

export const MimeType = end => {
    const ext = mimeTypeMap[end]
    if (ext)
        return ext
    else 
        return 'application/octet-stream'
}