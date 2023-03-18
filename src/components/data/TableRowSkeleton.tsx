import React from 'react';
import { Group, Skeleton, Stack, Table } from '@mantine/core';

interface TableRowSkeletonPros {
  columnsCount: number;
  rowsCount?: number;
  actionIndex?: number;
  profileIndex?: number;
}

const Cell = () => (
  <Stack>
    <Skeleton height={16} width="90%" />
    <Skeleton height={16} width="40%" />
  </Stack>
);

const TableRowSkeleton = ({ columnsCount, profileIndex = 0, actionIndex, rowsCount = 1 }: TableRowSkeletonPros) => {
  const profile = (
    <Group>
      <Skeleton height={40} width={40} circle />
      <Stack sx={{ flex: 1 }}>
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="40%" />
      </Stack>
    </Group>
  );
  return (
    <Table>
      {Array.from(Array(rowsCount)).map((item, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from(Array(columnsCount)).map((item, columnIndex) => (
            <td style={{ padding: 20 }} key={`${rowIndex}-${columnIndex}`} width={`${100 / columnsCount}%`}>
              {columnIndex === profileIndex ? (
                profile
              ) : columnIndex === actionIndex ? (
                <Skeleton height={32} width="90%" />
              ) : (
                <Cell />
              )}
            </td>
          ))}
        </tr>
      ))}
    </Table>
  );
};

export default TableRowSkeleton;
