{ pkgs, ... }:
{
  packages = [
    pkgs.git
    pkgs.nodejs_20
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.python311Packages.virtualenv
    pkgs.sqlite
    pkgs.openssl
    pkgs.pkg-config
    pkgs.libffi
    pkgs.zlib
  ];

  env = {
    DJANGO_SETTINGS_MODULE = "condo_backend.settings";
    PYTHONUNBUFFERED = "1";
    VITE_HOST = "0.0.0.0";
    VITE_PORT = "5173";
    VITE_API_BASE_URL = "http://localhost:8000/api";
    ALLOWED_HOSTS = "localhost,127.0.0.1,0.0.0.0";
  };

  idx = {
    extensions = [
      "ms-python.python"
      "ms-toolsai.jupyter"
      "dbaeumer.vscode-eslint"
    ];

    previews = {
      frontend = {
        command = "npm install && npm run dev -- --host 0.0.0.0 --port 5173";
        manager = "node";
        env = {
          VITE_API_BASE_URL = "http://localhost:8000/api";
        };
      };
      backend = {
        command = "python -m pip install -r requirements.txt && python manage.py migrate && python manage.py runserver 0.0.0.0:8000";
        manager = "python";
      };
    };
  };
}
