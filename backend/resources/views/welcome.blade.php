<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Manager Backend</title>
    <style>
        body {
            font-family: sans-serif;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .box {
            background: white;
            border-radius: 0.5rem;
            padding: 2rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            max-width: 500px;
            text-align: center;
        }
        a {
            color: #2563eb;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="box">
        <h1 style="margin-bottom: 1rem;">Order Manager Backend</h1>
        <p>Questa è la home del backend dell'applicazione <strong>Order Manager</strong>.</p>
        <p>Per accedere all’interfaccia utente, visita:</p>
        <p><a href="http://localhost:5000" target="_blank">http://localhost:5000</a></p>
    </div>
</body>
</html>
