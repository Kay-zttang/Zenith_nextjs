'use server';
import {z} from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id:z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.'
    }),
    amount: z.coerce.number().gt(0, {message: 'Please enter an amount greater than $0.'}),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoive status.'
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id:true, date:true});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?:string[];
    };
    message?: string | null;
}

export async function createInvoice(pervState: State, formData: FormData){
    /*safeparse return success or error field; no need for try{}catch(error){}*/
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data
    /* store monetary values in cents to eliminate JavaScript floating-point errors */
    const amountInCents = amount * 100 
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
          message: 'Database Error: Failed to Create Invoice.',
        };
    }

    /*redirect outside try{}catch(error){}; since redirect works by throwing an error*/
    /*throwing an error using: throw new Error('Some error msg here')*/
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id:string, formData: FormData) {
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100 
    
    try {
        await sql `
        Update invoices
        set customer_id = ${customerId}, amount =${amountInCents}, status = ${status}
        where id = ${id}
        `;
    } catch (error){
        console.log(error);
    }
    

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id:string) {
    
    await sql `
        Delete from invoices
        where id = ${id}
    `;
    revalidatePath('/dashboard/invoices');
}
