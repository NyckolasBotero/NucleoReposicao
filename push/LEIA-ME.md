# Notificações push — implantação (uma vez só)

1. **Cloudflare**: crie uma conta gratuita em dash.cloudflare.com > Workers & Pages > Create > Create Worker (nome: `nucleo-push`) > Deploy > Edit code. Apague o código e cole o conteúdo de `worker_push.js`. Deploy.
2. No Worker: Settings > Variables and Secrets > adicione (tipo Secret): `SEGREDO`, `VAPID_PUBLICA`, `VAPID_PRIVADA` (valores enviados no chat). Deploy.
3. Copie a URL do Worker (`https://nucleo-push.<sua-conta>.workers.dev`).
4. **Apps Script**: substitua o código por `apps_script_nucleo.gs` e publique **Nova versão** na implantação atual. Em Configurações do projeto > Propriedades do script, crie: `PUSH_URL` (URL do Worker), `PUSH_SEGREDO` (mesmo valor de `SEGREDO`), `VAPID_PUBLICA` (mesmo valor).
5. No painel: sino > engrenagem > Notificações no celular > Ativar neste aparelho > Enviar teste.

`teste_rfc.mjs` e `teste_envio.mjs` validam a criptografia (`node teste_rfc.mjs`).
