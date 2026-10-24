rule Suspicious_PowerShell_Encoded
{
    meta:
        author = "lead"
        confidence = "low"
    strings:
        $a = "powershell" nocase
        $b = "-enc" nocase
        $c = "FromBase64String" nocase
    condition:
        all of them
}

rule Ransomware_Note_Strings
{
    meta:
        author = "lead"
        confidence = "low"
    strings:
        $a = "your files have been encrypted" nocase
        $b = "bitcoin" nocase
    condition:
        any of them
}
