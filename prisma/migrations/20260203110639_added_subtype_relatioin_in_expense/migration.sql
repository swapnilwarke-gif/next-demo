-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_sub_expense_type_fkey" FOREIGN KEY ("sub_expense_type") REFERENCES "public"."SubExpenseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
