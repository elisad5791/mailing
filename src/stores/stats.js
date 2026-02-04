import { defineStore } from 'pinia';
import { apolloClient }  from '../api/apollo.js';
import { ref } from 'vue';
import gql from 'graphql-tag';

export const useStatsStore = defineStore('stats', function () {
  const stats = ref({
    totalMailings: { all: 0, success: 0, partly: 0, error: 0 },
    mailingsToday: { all: 0, success: 0, partly: 0, error: 0 },
    deliveredSms: { all: 0, today: 0, week: 0, month: 0 },
    deliveredEmails: { all: 0, today: 0, week: 0, month: 0 },
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
      const { data } = await apolloClient.query({ 
        query: allStatsQuery,
        fetchPolicy: 'network-only' 
      });
      stats.value = data.allStats[0];
    } finally {
      isLoading.value = false;
    } 
  };

  async function updateStat(type, count) {
    isLoading.value = true;
    
    const data = { 
      id: 1,
      totalMailings: {
        all: stats.value.totalMailings.all + 1,
        success: stats.value.totalMailings.success + 1,
        partly: stats.value.totalMailings.partly,
        error: stats.value.totalMailings.error
      },
      mailingsToday: {
        all: stats.value.mailingsToday.all + 1,
        success: stats.value.mailingsToday.success + 1,
        partly: stats.value.mailingsToday.partly,
        error: stats.value.mailingsToday.error
      }
    };

    if (type == 'email') {
      data.deliveredEmails = {
        all: stats.value.deliveredEmails.all + count,
        today: stats.value.deliveredEmails.today + count,
        week: stats.value.deliveredEmails.week + count,
        month: stats.value.deliveredEmails.month + count,
      };
    } else if (type == 'sms') {
      data.deliveredSms = {
        all: stats.value.deliveredSms.all + count,
        today: stats.value.deliveredSms.today + count,
        week: stats.value.deliveredSms.week + count,
        month: stats.value.deliveredSms.month + count,
      };
    }

    const updateStatMutation= gql`
      mutation UpdateStat(
        $id: ID!
        $totalMailings: JSON
        $mailingsToday: JSON
        $deliveredSms: JSON
        $deliveredEmails: JSON
        $chartData: JSON
      ) {
        updateStat(
          id: $id
          totalMailings: $totalMailings
          mailingsToday: $mailingsToday
          deliveredSms: $deliveredSms
          deliveredEmails: $deliveredEmails
          chartData: $chartData
        ) {
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
      await apolloClient.mutate({ 
        mutation: updateStatMutation, 
        variables: data
      });
      
      await fetchStats();
    } finally {
      isLoading.value = false;
    }
  }

  return { stats, isLoading, error, fetchStats, updateStat };
});