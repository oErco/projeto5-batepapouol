let botaoAtivo = document.querySelector(".login-Button");
let inputAtivo = document.querySelector(".login-screen input");
const mensagem = document.querySelector(".error");
let nome; 

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
  setTimeout(function(){document.querySelector(".loading").classList.add("hidden");}, 1500);
  //const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
  //promessa.then(validarNome);
  const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
  promessa.then(entrarNaSala);
  promessa.catch(erroLogin);
}

/*
function validarNome(resposta){
  let nomeValido = true;
  const listaUsuarios = resposta.data;
  const mensagem = document.querySelector(".error");
  console.log(listaUsuarios);

  for (let i = 0; i < listaUsuarios.length; i++){
    if (listaUsuarios[i].name.toLowerCase() === nome.toLowerCase()){
      nomeValido = false;
    }
  }

  if (nomeValido) {
    //Entra na sala
    mensagem.classList.add("hidden");
    document.querySelector(".login-screen").classList.add("hidden");
    setTimeout(entrarNaSala, 500);
  }
  else {
    // Mostra mensagem: "O nome ${nome} já está em uso, por favor digite outro nome"
    document.querySelector(".login-screen input").style.backgroundColor = "rgb(255, 216, 216)";
    mensagem.innerHTML = `O nome ${nome} já está em uso! <br> Por favor digite outro nome`;
    mensagem.classList.remove("hidden");
  }
}
*/

function entrarNaSala(resposta){
  mensagem.classList.add("hidden");
  document.querySelector(".login-screen").classList.add("hidden");
  // setTimeout(exibirMensagens, 500);
  botaoAtivo = document.querySelector(".botaoEnviar");
  inputAtivo = document.querySelector(".mensage-input input");
  const parar = setInterval(carregarMensagens, 3000);
  carregarMensagens();
}

/*
function loginUsuario(resposta){
  console.log(resposta);
  const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  promessa.then(exibirMensagens);
}
*/

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
      mensagem = `<li class="log"> 
                    <p> <span class="time">(${listaMensagens[i].time})</span>
                    <span class="author">${listaMensagens[i].from}</span>
                    <span class="message-text">${listaMensagens[i].text}</span></p>
                  </li> `;
      chat.innerHTML = chat.innerHTML + mensagem;
    }
    if (listaMensagens[i].type === "message"){
      mensagem = `<li class="public message"> 
                    <p> <span class="time">(${listaMensagens[i].time})</span>
                    <span class="author">${listaMensagens[i].from}</span>
                    para
                    <span class="receiver">${listaMensagens[i].to}</span>: 
                    <span class="message-text">${listaMensagens[i].text}</span></p>
                  </li> `;
      chat.innerHTML = chat.innerHTML + mensagem;
    }
    if (listaMensagens[i].type === "private_message" && (listaMensagens[i].from === nome || listaMensagens[i].to === nome)){
      mensagem = `<li class="private message"> 
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
  document.querySelector(".chat").scrollIntoView(false, {block: "end"});
}

function erroLogin(erro){
  if (erro.response.status === 400){
    document.querySelector(".login-screen input").style.backgroundColor = "rgb(255, 216, 216)";
    mensagem.innerHTML = `O nome ${nome} já está em uso! <br> Por favor digite outro nome`;
    mensagem.classList.remove("hidden");
  }
}

function abrirSidebar(){
  document.querySelector(".users-list").classList.remove("hidden");
  // setTimeout(function(){document.querySelector(".users-list").classList.add("hidden");}, 5000);
}




// Enviar o nome do usuário para o servidor para cadastro
  // Caso tiver sucesso o usuário entra na sala e a página do chat é aberta
  // Caso der erro, deve-se pedir para o usuário digitar outro nome, pois este já está em uso

// carregar as mensagens do servidor

// exibir as mensagens do servidor conforme layout fornecido

  // As mensagens com Reservadamente só devem ser exibidas se o nome do destinatário ou remetente for igual ao nome do usuário que está usando o chat

// A cada três segundos o site deve recarregar as mensagens do servidor

// A cada 5 segundos o site deve avisar ao servidor que o usuário ainda está presente, ou senão será considerado que "Saiu da sala"

// O chat deverá ter rolagem automática por padrão


// Enviar mensagem para o servidor 

  // Deve ser informado o remetente, o destinatário e se a mensagem é reservada ou não

  // Caso de sucesso: obter novamente as mensagens do servidor e atualizar o chat
  
  // Caso de erro: significa que esse usuário não está mais na sala e a página deve ser atualizada (e com isso voltando pra etapa de pedir o nome)


// Bonus 

  // Faça com que, caso o usuário tecle Enter no campo de mensagem, ela seja enviada

  // Ao clicar no fundo escuro do sidebar o menu lateral deve ser ocultado novamente

  // O site deve obter a lista de participantes assim que entra no chat e deve atualizar a lista a cada dez segundos

  // Ao clicar em uma pessoa ou em público/reservadamente, a opção clicada deve ser marcada com um check e as demais desmarcadas

  // Além do check acima, ao trocar esses parâmetros também deve ser alterada a frase que informa o destinatário, que fica embaixo do input de mensagem




