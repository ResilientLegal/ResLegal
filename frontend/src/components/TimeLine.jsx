import { Timeline, Text } from '@mantine/core';
import { TbFileDescription, TbCircleCheck } from 'react-icons/tb';
import { MdOutlinePendingActions } from 'react-icons/md';
import DJANGO_PORT from '../services/setting.js';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/Timeline.css';
import { useEffect, useState } from 'react';
import { fetchTransactionById } from '../services/Transactions.js';


const formatTimeAgo = (utcTimestamp) => {
  const pastTime = new Date(utcTimestamp);
  const now = new Date();

  const diffInMilliseconds = now.getTime() - pastTime.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  const hoursThreshold = 24;

  if (diffInHours < hoursThreshold) {
    const diffInMinutes = Math.round(diffInMilliseconds / (1000 * 60));
    const diffInHoursRounded = Math.round(diffInHours);

    if (diffInMinutes < 60) {
      return `${Math.max(1, diffInMinutes)} minutes ago`;
    } else {
      return `${diffInHoursRounded} hours ago`;
    }

  } else {

    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return formatter.format(pastTime);
  }
}

const TimeLine = ({ matterId }) => {
  const [timestamps, setTimestamps] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${DJANGO_PORT}/api/matter-transactions/?matter_id=${matterId}`)
      .then((response) => response.json())
      .then(async (data) => {
        const transaction = data[0];
        const txn_in_progress_id = transaction.txn_in_progress_id;

        if (!txn_in_progress_id) {
          console.warn('No transaction IDs found for this matter.');
          return data;
        }

        const fetchedData = await fetchTransactionById(txn_in_progress_id);
        setTimestamps(prev => ({
          ...prev,
          in_progress: formatTimeAgo(fetchedData.value.timestamp)
        }));

        return data;
      })
      .then(async (data) => {
        const transaction = data[0];
        const txn_pending_approval_id = transaction.txn_pending_approval_id;

        if (!txn_pending_approval_id) {
          console.warn('No transaction IDs found for this matter.');
          return data;
        }

        const fetchedData = await fetchTransactionById(txn_pending_approval_id);

        setTimestamps(prev => ({
          ...prev,
          pending_approval: formatTimeAgo(fetchedData.value.timestamp)
        }));
        return data;
      }).then(async (data) => {
        const transaction = data[0];
        const txn_approved_id = transaction.txn_approved_id;

        if (!txn_approved_id) {
          console.warn('No transaction IDs found for this matter.');
          return data;
        }

        const fetchedData = await fetchTransactionById(txn_approved_id);

        setTimestamps(prev => ({
          ...prev,
          approved: formatTimeAgo(fetchedData.value.timestamp)
        }));
        return data;
      })
      .catch((error) => {
        console.error('Error fetching matter transactions:', error);
      }).finally(() => {
        setIsLoading(false);
      });
  }, [matterId]);

  useEffect(() => {
    console.log(timestamps)
  }, [timestamps])

  return (
    <>
      {
        isLoading ? null :
          (
            <div>
              <h3 style={{ textAlign: "center" }}>Matter Timeline</h3>

              <Timeline active={Object.keys(timestamps).length - 1} bulletSize={40} lineWidth={2} color='blue' align="left">
                <Timeline.Item bullet={<TbFileDescription size={32} />} title="In Progress">
                  <Text c="dimmed" size="sm">Matter was created</Text>
                  <Text size="xs" mt={4}>{timestamps.in_progress}</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<MdOutlinePendingActions size={32} />} title="Approval requested">
                  <Text c="dimmed" size="sm">Matter has been submitted for approval</Text>
                  <Text size="xs" mt={4}>{timestamps.pending_approval}</Text>
                </Timeline.Item>
                <Timeline.Item bullet={<TbCircleCheck size={32} />} title="Approved" lineVariant="dashed">
                  <Text c="dimmed" size="sm">Matter was approved</Text>
                  <Text size="xs" mt={4}>{timestamps.approved}</Text>
                </Timeline.Item>
              </Timeline>
            </div>
          )}
    </>
  );
}
export default TimeLine;

