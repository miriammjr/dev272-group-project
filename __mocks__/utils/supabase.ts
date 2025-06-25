const supabase = {
  from: () => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  }),
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
  },
};

module.exports = supabase;
