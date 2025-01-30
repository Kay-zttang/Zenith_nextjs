'use server';
import {z} from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id:z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id:true, date:true});

export async function createInvoice(formData: FormData){
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    /* store monetary values in cents to eliminate JavaScript floating-point errors */
    const amountInCents = amount * 100 
    const date = new Date().toISOString().split('T')[0];

    await sql`
        Insert into invoices (customer_id, amount, status, date)
        values (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('dashboard/invoices');
}

export async function updateInvoice(id:string, formData: FormData) {
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100 
    
    await sql `
        Update invoices
        set customer_id = ${customerId}, amount =${amountInCents}, status = ${status}
        where id = {id}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('dashboard/invoices');
}

export async function deleteInvoice(id:string) {

    await sql `
        Delete from invoices
        where id = {id}
    `;
    revalidatePath('/dashboard/invoices');
}
