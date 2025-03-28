import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type AppCardProps = { title: string; children: React.ReactNode };

const AppCard: React.FC<AppCardProps> = ({ title, children }) => {
  return (
    <Card>
      <CardHeader className="px-6">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-6">{children}</CardContent>
    </Card>
  );
};

export default AppCard;
