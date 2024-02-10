import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useRef } from 'react';
import Loader from './loader/loader';
import Swal from 'sweetalert2';
function App() {
  // armazena os dados dentro da variavel e atualiza através do useState
  const input = useRef(null);
  const [data, setData] = useState(null);

  const [cep, setCep] = useState('');

  const [logradouro, setLogradouro] = useState('');

  const [uf, setUf] = useState('');

  const [bairro, setBairro] = useState('');

  const [localidade, setLocalidade] = useState('');

  const [loading, setLoading] = useState(false)

  const url = 'https://viacep.com.br/ws/'; //armazena a api em uma variavel chamada url

  // useEffect é usado para executar ações com base em mudanças de estado
  useEffect(() => {     // useEffect é usado para executar ações com base em mudanças de estado.
    if (input.current && input.current.value) {
      fetchData();
    }
  }, []);

  // função assíncrona para buscar os dados do CEP
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + input.current.value + '/json');
      const data = await response.json();
      setTimeout(() => {
        if (data.erro) {
          // Se o CEP não for encontrado, limpa os dados existentes
          setData(null);
        } else {
          // Caso contrário, atualiza os dados do CEP
          setData(data);
          setCep(data.cep);
          setLogradouro(data.logradouro);
          setUf(data.uf);
          setLocalidade(data.localidade);
          setBairro(data.bairro);
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      // Em caso de erro, limpa os dados existentes
      setData(null);
      setLoading(false);
    }
  };

  // função para lidar com a ação de pesquisa
  const handleSearch = () => { // função que pesquisa o cep ao clicar.
    if (input.current.value.length !== 8) {
      Swal.fire({

        icon: "warning",
        title: "Oops...",
        text: "CEP invalido digite novamente!",

      });
    } else {
      fetchData();
    }
  };

  return (
    <div className='container'>
      <h1>Buscador de CEP</h1>
      <div className='container-input'>
        <div>
          <label>
            <input
              type="text"
              placeholder='Pesquisar cep'
              required
              ref={input}
            />
          </label>
          <button type="button" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className='info-container'>
            {data && (
              <div>
                <h2>CEP: <span style={{ marginLeft: '5px' }}>{cep}</span> </h2>
                <p>Rua: <span style={{ fontWeight: 'bold', fontSize: '21px', marginLeft: '5px' }}>{logradouro}</span> </p>
                <p>Bairro: <span style={{ fontWeight: 'bold', fontSize: '21px', marginLeft: '5px' }}>{bairro}</span></p>
                <p>Cidade: <span style={{ fontWeight: 'bold', fontSize: '21px', marginLeft: '5px' }}>{localidade}</span> </p>
                <p>Estado:  <span style={{ fontWeight: 'bold', fontSize: '21px', marginLeft: '5px' }}>{uf}</span></p>

              </div>
            )}
          </div>
        )}
      </div>
      <footer>Desenvolvido por <span style={{ display: 'inline', fontWeight: 'bold' }}>Pedro &#169;</span> </footer>
    </div >
  )
}

export default App;
