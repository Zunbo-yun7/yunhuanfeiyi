$files = Get-ChildItem "c:\Users\Y90000P\Desktop\三下乡\image\*.jpg" | Sort-Object Name
$i = 1
foreach ($f in $files) {
    Copy-Item $f.FullName "c:\Users\Y90000P\Desktop\三下乡\server\public\masks\mask-$i.jpg" -Force
    $i++
}
Get-ChildItem "c:\Users\Y90000P\Desktop\三下乡\server\public\masks" | Select-Object Name
