export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type Agent = {
  AgentID: number;
  FirstName: string;
  LastName: string;
  Email?: string;
  PhoneNumber?: string;
  Username: string;
  Password: string;
  middle_name?: string;
  householdID?: number;
  active?: number;
  AgentType: string;
  additional_info?: string;
  Volunteer?: number;
  Title?: string;
};

export type AuthUser = {
  agentId: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  volunteer: boolean;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
