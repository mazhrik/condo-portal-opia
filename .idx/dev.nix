{ pkgs, ... }:
{
  channel = "stable-24.11";

  packages = [
    pkgs.git
    pkgs.nodejs_20
    pkgs.python311
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
    # Preview URLs use a generated hostname; allow all hosts in this dev env.
    ALLOWED_HOSTS = "*";
  };

  idx = {
    extensions = [
      "ms-python.python"
      "ms-toolsai.jupyter"
      "dbaeumer.vscode-eslint"
    ];

    workspace = {
      onCreate = {
        npm-install = "npm install";
        python-install = ''
          python3 -m venv .venv
          . .venv/bin/activate
          python3 -m pip install -r requirements.txt
        '';
      };
      onStart = {
        backend = ''
          . .venv/bin/activate
          python3 manage.py migrate
          python3 manage.py runserver 0.0.0.0:8000
        '';
      };
    };

    previews = {
      enable = true;
      previews = {
        web = {
          command = [
            "npm"
            "run"
            "dev"
            "--"
            "--host"
            "0.0.0.0"
            "--port"
            "$PORT"
          ];
          manager = "web";
          env = {
            # Route API requests through the dev server; see vite proxy config.
            VITE_API_BASE_URL = "/api";
          };
        };
      };
    };
  };
}
