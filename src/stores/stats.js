import { defineStore } from 'pinia';
import { apolloClient }  from '../api/apollo.js';
import { ref } from 'vue';
import gql from 'graphql-tag';

export const useStatsStore = defineStore('stats', function () {
  const stats = ref({
    mailingsTotal: 0,
    mailingsToday: 0,
    deliveredSms: 0,
    deliveredEmails: 0,
    chartData: { lastWeek: [], lastMonth: [] }
  });
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchStats() {
    isLoading.value = true;
    error.value = null;

    const allStatsQuery = gql`
      query Stats {
        allStats {
          id
          totalMailings
          mailingsToday
          deliveredSms
          deliveredEmails
          chartData
        }
      }
    `;

    try {
      const { data } = await apolloClient.query({ query: allStatsQuery });
      stats.value = data.allStats[0];
    } finally {
      isLoading.value = false;
    } 
  };

  return { stats, isLoading, error, fetchStats };
});