let botaoAtivo = document.querySelector(".login-Button");
let inputAtivo = document.querySelector(".login-screen input");
const mensagem = document.querySelector(".error");
let nome; 
let usuarios = ["Todos"];
let privacidade = "message";
let destinatario = "Todos";
let textoPrivacidade ="";

configuraTextoPrivacidade();
document.addEventListener("keypress", clicaEnter);

function clicaEnter(tecla){
  if(tecla.key === 'Enter' && inputAtivo.value.length !== 0) {   
    botaoAtivo.click();  
  }
} 
function resetInput (elemento){
  elemento.style.backgroundColor = "white";
}
// Ativa o botão quando o usuário entra com o nome para fazer login
function ativarBotao(input){
  const botao = document.querySelector(".login-Button");  
  if (input.value.length >= 1){
    botao.style.backgroundColor = "#9dbd6a";
    botao.style.color = "White";
    botao.classList.add("habilitado");
    botao.removeAttribute("disabled");
  }
  else {
    botao.style.backgroundColor = "#E7E7E7";
    botao.style.color = "#696969";
    botao.classList.remove("habilitado");
  }
}
function logar(){
  nome = document.querySelector("input").value;
  let usuario = {name: nome};
  const loading = document.querySelector(".loading");
  loading.classList.remove("hidden");
  setTimeout(function(){document.querySelector(".loading").classList.add("hidden");}, 2000);
  //const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
  //promessa.then(validarNome);
  const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
  promessa.then(entrarNaSala);
  promessa.catch(erroLogin);
}
function entrarNaSala(resposta){
  document.querySelector("footer input").value = "";
  mensagem.classList.add("hidden");
  document.querySelector(".login-screen").classList.add("hidden");
  botaoAtivo = document.querySelector(".botaoEnviar");
  inputAtivo = document.querySelector(".message-input input");
  const pararMensagens = setInterval(carregarMensagens, 3000);
  const deslogar = setInterval(manterConexao, 5000);
  setInterval(carregarParticipantes, 10000);
  carregarMensagens();
  carregarParticipantes();
}
function carregarMensagens(){
  const promesssa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  promesssa.then(exibirMensagens); 
}
function exibirMensagens(resposta){
  const listaMensagens = resposta.data;
  const chat = document.querySelector(".chat");
  chat.innerHTML = "";
  let mensagem;
  for (let i = 0; i < listaMensagens.length; i++){
    if (listaMensagens[i].type === "status"){
      mensagem = `<li data-test="message" class="log"> 
                    <p> <span class="time">(${listaMensagens[i].time})</span>
                    <span class="author">${listaMensagens[i].from}</span>
                    <span class="message-text">${listaMensagens[i].text}</span></p>
                  </li> `;
      chat.innerHTML = chat.innerHTML + mensagem;
    }
    if (listaMensagens[i].type === "message"){
      mensagem = `<li data-test="message" class="public message"> 
                    <p> <span class="time">(${listaMensagens[i].time})</span>
                    <span class="author">${listaMensagens[i].from}</span>
                    para
                    <span class="receiver">${listaMensagens[i].to}</span>: 
                    <span class="message-text">${listaMensagens[i].text}</span></p>
                  </li> `;
      chat.innerHTML = chat.innerHTML + mensagem;
    }
    if (listaMensagens[i].type === "private_message" && (listaMensagens[i].from.toLowerCase().trim() === nome.toLowerCase().trim() || listaMensagens[i].to.toLowerCase().trim() === nome.toLowerCase().trim())){
      mensagem = `<li data-test="message" class="private message"> 
                    <p> <span class="time">(${listaMensagens[i].time})</span>
                    <span class="author">${listaMensagens[i].from}</span>
                    <span class="privately">reservadamente</span>
                    para
                    <span class="receiver">${listaMensagens[i].to}</span>: 
                    <span class="message-text">${listaMensagens[i].text}</span></p>
                  </li> `;
      chat.innerHTML = chat.innerHTML + mensagem;
    }    
  }
  document.querySelector(".chat").scrollIntoView(false);
}
function manterConexao(){
  let usuario = {name: nome};
  const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
}
function erroLogin(erro){
  if (erro.response.status === 400){
    document.querySelector(".login-screen input").style.backgroundColor = "rgb(255, 216, 216)";
    mensagem.innerHTML = `O nome ${nome} já está em uso! <br> Por favor digite outro nome`;
    mensagem.classList.remove("hidden");
  }
}
function abrirSidebar(){
  document.querySelector(".titulo").scrollIntoView(true);
  document.querySelector(".users-list").classList.remove("hidden");
}
function fecharSidebar(){
  document.querySelector(".users-list").classList.add("hidden");
}
function carregarParticipantes (){
  const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
  promessa.then(verificarUsuarios);
}
function verificarUsuarios(resposta){
  const listaUsuariosServidor = resposta.data;
  const listaNomes = [];

  // Compara a lista usuarios e os elementos (.name) de listaUsuariosServidor
  // Se o elemento já existe em usuários, não faz nada
  // Se o elemento não existe em usuários, acrescenta no final da lista

  for (let i = 0; i < listaUsuariosServidor.length; i++){
    listaNomes.push(listaUsuariosServidor[i].name);
    const jaExiste = usuarios.find(elemento => elemento.toLowerCase() === listaUsuariosServidor[i].name.toLowerCase());
    if (jaExiste === undefined){
      usuarios.push(listaUsuariosServidor[i].name);
    }
  }

  // Remover os elementos de usuários que não estão na lista atual de nome (listaNomes)
  for (let i = 0; i < usuarios.length; i++){
    const userOnline = listaNomes.find(elemento => elemento.toLowerCase() === usuarios[i].toLowerCase());
    if (userOnline === undefined && usuarios[i] !== "Todos"){
      usuarios.splice(i, 1);
    }
  }

  mostrarParticipantes();
}
function mostrarParticipantes(){
  const listaUsers = document.querySelector(".users");
  let mensagem;
  // Verifica se elemento.nome é igual a destinatario 
  // Se sim renderiza com img sem o hidden
  // Se não resnderiza com o img hidden
  listaUsers.innerHTML = "";

  for (let i = 0; i < usuarios.length; i++){

    if (destinatario.toLowerCase().trim() === usuarios[i].toLowerCase().trim()){
      if (destinatario.toLowerCase().trim() === "todos"){
        mensagem = `<li data-test="all" class="user-message destinatario" onclick="escolheDestinatario(this);"> 
                      <div>
                          <ion-icon name="people"></ion-icon>
                          <p> Todos </p>
                      </div>
                      <img data-test="check" src="./img/checkmark.png" alt="Checkmark">
                    </li>`;
      }
      else {
        mensagem = `<li data-test="participant" class="user-message destinatario" onclick="escolheDestinatario(this);"> 
                    <div>
                        <ion-icon name="person-circle"></ion-icon>
                        <p> ${usuarios[i]} </p>
                    </div>
                    <img data-test="check" src="./img/checkmark.png" alt="Checkmark">
                  </li>`;
      }
    }

    else {

      if (usuarios[i].toLowerCase().trim() === "todos"){
        mensagem = `<li data-test="all" class="user-message" onclick="escolheDestinatario(this);"> 
                      <div>
                          <ion-icon name="people"></ion-icon>
                          <p> Todos </p>
                      </div>
                      <img data-test="check" src="./img/checkmark.png" alt="Checkmark" class="hidden">
                    </li>`;
      }
      else {
        mensagem = `<li data-test="participant" class="user-message" onclick="escolheDestinatario(this);"> 
                      <div>
                          <ion-icon name="person-circle"></ion-icon>
                          <p> ${usuarios[i]} </p>
                      </div>
                      <img data-test="check" src="./img/checkmark.png" alt="Checkmark" class="hidden">
                    </li>`;
      }
    }
      
    listaUsers.innerHTML = listaUsers.innerHTML + mensagem;
  }
}
function statusPrivacidade(escolha){
  if (escolha.classList.contains("publica")){
    privacidade = "message";
    document.querySelector(".privada img").classList.add("hidden");
    document.querySelector(".publica img").classList.remove("hidden");
  }
  else if (escolha.classList.contains("privada") && destinatario.toLowerCase().trim() !== "todos"){
    privacidade = "private_message";
    document.querySelector(".publica img").classList.add("hidden");
    document.querySelector(".privada img").classList.remove("hidden"); 
  }
  configuraTextoPrivacidade();
}
function escolheDestinatario(escolha){

  let destinatarioAnterior = document.querySelector(".destinatario");

  if (destinatarioAnterior !== null ){
    destinatarioAnterior.classList.remove("destinatario");
    destinatarioAnterior.children[1].classList.add("hidden");
  }    

  escolha.classList.add("destinatario");
  destinatario = escolha.children[0].children[1].innerHTML;
  escolha.children[1].classList.remove("hidden");

  if (destinatario.toLowerCase().trim() === "todos"){
    //Muda privacidade para público
    privacidade = "message";
    document.querySelector(".privada img").classList.add("hidden");
    document.querySelector(".publica img").classList.remove("hidden");
  }

  configuraTextoPrivacidade();
}
function configuraTextoPrivacidade(){
  let configMensagem = document.querySelector(".message-input p");

  if (privacidade === "message"){
    textoPrivacidade = "publicamente";
  }
  else {
    textoPrivacidade = "reservadamente";
  }
  configMensagem.innerHTML = `<p>Enviando para <span class="receiver-selected"> ${destinatario} </span> (<span class="privacy-selected">${textoPrivacidade}</span>)</p>`;
}
function enviarMensagem(){
  let texto = document.querySelector(".message-input input");

  if (texto.value.length > 0){
    let mensagem = {from: nome, to: destinatario, text: texto.value, type: privacidade};
    console.log(mensagem);
    let promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
    texto.value = "";
    promessa.then(carregarMensagens);
    promessa.catch(erroMensagem);
  }  
}
function erroMensagem(resposta){
  window.location.reload();
}

  
// Quebra de texto nas mensagens e nos usuários