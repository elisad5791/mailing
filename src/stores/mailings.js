import { defineStore } from 'pinia';
import { apolloClient }  from '../api/apollo.js';
import { ref } from 'vue';
import gql from 'graphql-tag';

export const useMailingsStore = defineStore('mailings', function () {
  const mailings = ref([]);
  const currentMailing = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchMailings() {
    loading.value = true;

    const allMailingsQuery = gql`
      query Mailings {
        allMailings {
          id
          name
          type
          status
          recipients
          template_id
          scheduleType
          scheduleData
          stats
          createdAt
        }
      }
    `;

    try {
      const { data } = await apolloClient.query({ 
        query: allMailingsQuery,
        fetchPolicy: 'network-only'  
      });

      mailings.value = [...data.allMailings].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchMailingById(id) {
    loading.value = true;
    currentMailing.value = null;

    const mailingQuery = gql`
      query Mailing($id: ID!) {
        Mailing(id: $id) {
          id
          name
          type
          status
          recipients
          Template {
            id
            name
          }
          scheduleType
          scheduleData
          stats
          createdAt
        }
      }
    `;

    try {
      const result = await apolloClient.query({
        query: mailingQuery,
        variables: { id },
        fetchPolicy: 'network-only' 
      });
      currentMailing.value = result.data.Mailing;
    } finally {
      loading.value = false;
    }
  }

  async function deleteMailing(id) {
    loading.value = true;

    const deleteMailingMutation = gql`
      mutation DeleteMailing($id: ID!) {
        deleteMailing(id: $id) {
          id
        }
      }
    `;
    
    try {
      await apolloClient.mutate({ 
        mutation: deleteMailingMutation, 
        variables: { id }
      });

      mailings.value = mailings.value.filter(mailing => mailing.id !== id);
      if (currentMailing.value?.id === id) {
        currentMailing.value = null;
      }
    } finally {
      loading.value = false;
    }

    return true;
  }

  async function createMailing(data) {
    loading.value = true;
    data.recipients = data.recipients.split(',').map(item => item.trim());
    data.createdAt = new Date().toISOString();

    const createMailingMutation = gql`
      mutation CreateMailing(
        $name: String!
        $type: String!
        $status: String!
        $recipients: [String!]!
        $template_id: ID!
        $scheduleType: String!
        $stats: JSON
        $createdAt: Date!
        $scheduleData: JSON
      ) {
        createMailing(
          name: $name
          type: $type
          status: $status
          recipients: $recipients
          template_id: $template_id 
          scheduleType: $scheduleType
          stats: $stats 
          createdAt: $createdAt
          scheduleData: $scheduleData 
        ) {
          id
          name
          type
          status
          recipients
          template_id
          scheduleType
          stats
          createdAt
          scheduleData
        }
      }
    `;
    
    try {
      await apolloClient.mutate({ 
        mutation: createMailingMutation, 
        variables: data,
      });
      
      await fetchMailings();
    } finally {
      loading.value = false;
    }
  }

  async function updateMailing({ id, data }) {
    loading.value = true;
    data.recipients = data.recipients.split(',').map(item => item.trim());
    data.id = id;

    const updateMailingMutation= gql`
      mutation UpdateMailing(
        $id: ID!
        $name: String!
        $type: String!
        $status: String!
        $recipients: [String!]!
        $template_id: ID!
        $scheduleType: String!
        $stats: JSON
        $createdAt: Date!
        $scheduleData: JSON
      ) {
        updateMailing(
          id: $id
          name: $name
          type: $type
          status: $status
          recipients: $recipients
          template_id: $template_id 
          scheduleType: $scheduleType
          stats: $stats 
          createdAt: $createdAt
          scheduleData: $scheduleData 
        ) {
          id
          name
          type
          status
          recipients
          template_id
          scheduleType
          stats
          createdAt
          scheduleData
        }
      }
    `;

    try {
      await apolloClient.mutate({ 
        mutation: updateMailingMutation, 
        variables: data
      });

      if (currentMailing.value?.id === id) {
        await fetchMailingById(id);
      }
      
      await fetchMailings();
    } finally {
      loading.value = false;
    }
  }

  return { 
    mailings, currentMailing, loading, error, 
    fetchMailings, fetchMailingById, deleteMailing, createMailing, updateMailing
  };
});