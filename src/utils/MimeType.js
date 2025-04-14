const mimeTypeMap = {
    'txt': 'text/plain',
    'py': 'text/python',
    'md': 'text/markdown',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'text/json',
    'Dockerfile': 'text/plain',
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