import React from 'react';
import { Paper, Global } from '@mantine/core';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, Legend } from 'recharts';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { api } from '@utils/api';

const CampaignChart = () => {
  const { query } = useRouter();
  const { data } = api.activity.getActivitiesStats.useQuery({
    campaignId: query.campaignId as string,
  });
  return (
    <Paper shadow="sm" radius="md" p="xl">
      <Global
        styles={() => ({
          '.recharts-legend-item-text': { marginRight: 15, marginLeft: 5 },
        })}
      />
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart width={730} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickMargin={15}
            tickFormatter={value => dayjs(value).format('MMM D')}
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={10} />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Tooltip />
          <Area
            name="Contacted"
            type="natural"
            dataKey="CONTACTED"
            stroke="#AD64E8"
            fill="#AD64E8"
            legendType="circle"
          />
          <Area
            name="Total Opens"
            type="natural"
            dataKey="OPENED"
            fill="#1EABF1"
            stroke="#1EABF1"
            legendType="circle"
          />
          <Area
            name="Unique Opens"
            type="natural"
            dataKey="UNIQUE_OPENED"
            fill="#8DC252"
            stroke="#8DC252"
            legendType="circle"
          />
          <Area name="Replies" type="natural" dataKey="REPLIED" fill="#FEC93E" stroke="#FEC93E" legendType="circle" />
          <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '30px' }} />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CampaignChart;
