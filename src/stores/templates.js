import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apolloClient  from '../api/apollo.js';
import gql from 'graphql-tag';

export const useTemplatesStore = defineStore('templates', function() {
  const templates = ref([]);
  const currentTemplate = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const emailTemplates = computed(() => {
    return templates.value.filter(template => template.type === 'email');
  });

  const smsTemplates = computed(() => {
    return templates.value.filter(template => template.type === 'sms');
  });

  const fetchTemplates = async () => {
    isLoading.value = true;

    const allTemplatesQuery = gql`
      query Templates {
        allTemplates(sortField: "createdAt", sortOrder: "desc") {
          id
          name
          type
          subject
          body
          createdAt
        }
      }
    `;

    try {
      const { data } = await apolloClient.query({ query: allTemplatesQuery });
      templates.value = data.allTemplates;
    } finally {
      isLoading.value = false;
    }
  };

  async function fetchTemplateById(id) {
    isLoading.value = true;
    currentTemplate.value = null;

    const templateQuery = gql`
      query Template($id: ID!) {
        Template(id: $id) {
          id
          name
          type
          subject
          body
          createdAt
        }
      }
    `;

    try {
      const result = await apolloClient.query({
        query: templateQuery,
        variables: { id },
        fetchPolicy: 'network-only' 
      });
      currentTemplate.value = result.data.Template;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTemplate(id) {
    isLoading.value = true;

    const deleteTemplateMutation = gql`
      mutation DeleteTemplate($id: ID!) {
        deleteTemplate(id: $id) {
          id
        }
      }
    `;

    try {
      await apolloClient.mutate({ 
        mutation: deleteTemplateMutation, 
        variables: { id }
      });
    } finally {
      isLoading.value = false;
    }

    templates.value = templates.value.filter(template => template.id !== id);
    if (currentTemplate.value?.id === id) {
      currentTemplate.value = null;
    }

    return true;
  }

  async function createTemplate(data) {
    isLoading.value = true;
    data.createdAt = new Date().toISOString();

    const createTemplateMutation = gql`
      mutation CreateTemplate(
        $name: String!
        $type: String!
        $subject: String!
        $body: String!
        $createdAt: Date!
      ) {
        createTemplate(
          name: $name
          type: $type
          subject: $subject
          body: $body
          createdAt: $createdAt
        ) {
          id
          name
          type
          subject
          body
          createdAt
        }
      }
    `;

    try {
      const result = await apolloClient.mutate({ 
        mutation: createTemplateMutation, 
        variables: data,
      });
      templates.value = [...templates.value, result.data.createTemplate];
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTemplate({ id, data }) {
    isLoading.value = true;
    data.id = id;

    const updateTemplateMutation= gql`
      mutation UpdateTemplate(
        $id: ID!
        $name: String!
        $type: String!
        $subject: String!
        $body: String!
        $createdAt: Date!
      ) {
        updateTemplate(
          id: $id
          name: $name
          type: $type
          subject: $subject
          body: $body
          createdAt: $createdAt
        ) {
          id
          name
          type
          subject
          body
          createdAt
        }
      }
    `;

    try {
      const result = await apolloClient.mutate({ 
        mutation: updateTemplateMutation, 
        variables: data
      });

      if (currentTemplate.value?.id === id) {
        currentTemplate.value = { ...currentTemplate.value, ...result.data.updateTemplate };
      }
    } finally {
      isLoading.value = false;
    }
  }

  return { 
    templates, 
    isLoading, 
    error, 
    emailTemplates, 
    smsTemplates, 
    fetchTemplates, 
    currentTemplate, 
    fetchTemplateById, 
    deleteTemplate,
    createTemplate,
    updateTemplate
  };
});