$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()
Write-Host 'Server started on http://localhost:8000/'

while ($true) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.AbsolutePath
    if ($path -eq '/' -or $path -eq '/index.html') {
        $file = 'preview.html'
    } else {
        $file = $path.TrimStart('/')
    }
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        $content = [System.IO.File]::ReadAllBytes($fullPath)
        if ($file.EndsWith('.html')) {
            $ctx.Response.ContentType = 'text/html; charset=utf-8'
        } else {
            $ctx.Response.ContentType = 'application/octet-stream'
        }
        $ctx.Response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
}