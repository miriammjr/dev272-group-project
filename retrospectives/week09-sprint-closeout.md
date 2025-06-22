**Completed tasks**

Login/registration component (Miriam & Milton)

Task creation in the database (Milton)

Better layout (Jonathan)

Logout button (Jonathan)

**Unfinished tasks (with notes)**

Testing (Miriam) - strange bugs that can't be resolved

Bugs or blockers

- There were many issues with testing that would not go away no matter what.
- Database issues: Supabase had many issues with account creation and login, especially due to limited emails. Because it is limited to sending 2 emails per hour, testing was fairly limited. Additionally, there were issues with SQL scripting that caused issues with the database.
- Supabase redirect issues: because we have no idea how to access the redirect pages sent in emails from Supabase, we are unsure of how to create a "forgot password" function or change the email verification.

**Key wins and challenges**

- Login and registration now work.
- Task creation now works
- Supabase issues took up a lot of time
- Testing issues mean that nothing has been formally tested yet.

**Next sprint priorities**

- Fix formatting issues
- Make the "settings" screen scroll
