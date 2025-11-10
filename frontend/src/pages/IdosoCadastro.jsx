import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { IdosoForm } from '../components/IdosoForm';
import { Loader } from '../components/Loader';
import { PageHeader } from '../components/PageHeader';
import { isValidCPF, isValidAge, cleanCPF } from '../utils/validators';

const initialValues = {
  nome_completo: '',
  idade: '',
  sexo: '',
  endereco: '',
  rg: '',
  cpf: '',
  titulo_eleitoral: '',
  telefone: '',
};

export const IdosoCadastro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchIdoso = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/idosos/${id}`);
        const idosoData = data.data?.idoso || {};
        setValues({
          ...initialValues,
          ...idosoData,
          // Garantir que o CPF seja apenas números
          cpf: idosoData.cpf ? cleanCPF(idosoData.cpf) : '',
        });
      } catch (error) {
        toast.error('Não foi possível carregar os dados do idoso.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdoso();
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;

    // Formatar CPF
    if (name === 'cpf') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11);
    }

    // Formatar telefone
    if (name === 'telefone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11);
    }

    setValues((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const validateForm = () => {
    // Validar nome
    if (!values.nome_completo || values.nome_completo.trim().length < 3) {
      toast.error('Nome completo deve ter pelo menos 3 caracteres');
      return false;
    }

    // Validar idade
    if (!values.idade || !isValidAge(values.idade)) {
      toast.error('Idade inválida (deve ser entre 0 e 150)');
      return false;
    }

    // Validar sexo
    if (!values.sexo) {
      toast.error('Selecione o sexo');
      return false;
    }

    // Validar CPF
    if (!values.cpf) {
      toast.error('CPF é obrigatório');
      return false;
    }

    if (!isValidCPF(values.cpf)) {
      toast.error('CPF inválido (deve ter 11 dígitos)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação do formulário
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Formatar CPF antes de enviar
      const dataToSend = {
        ...values,
        cpf: values.cpf.replace(/\D/g, ''),
      };

      if (isEdit) {
        await api.put(`/idosos/${id}`, dataToSend);
        toast.success('Idoso atualizado com sucesso.');
      } else {
        await api.post('/idosos', dataToSend);
        toast.success('Idoso cadastrado com sucesso.');
      }
      navigate('/idosos');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Erro ao salvar idoso. Verifique os dados e tente novamente.';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <PageHeader
        title={isEdit ? 'Editar Idoso' : 'Cadastrar Idoso'}
        subtitle={
          isEdit
            ? 'Atualize as informações cadastrais do idoso'
            : 'Preencha os dados para cadastrar um novo idoso'
        }
        showBack
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Idosos', to: '/idosos' },
          { label: isEdit ? 'Editar' : 'Novo' },
        ]}
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <IdosoForm values={values} onChange={handleChange} onSubmit={handleSubmit} loading={saving} />
      </div>
    </div>
  );
};

