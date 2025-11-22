'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, FileText, PlusCircle, Upload, CalendarPlus, Download } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useSupabase } from '@/supabase';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PatientHistoryDialog = ({ patient }: { patient: any }) => {
    const [newNote, setNewNote] = useState('');
    const { user, supabase } = useSupabase();
    const { toast } = useToast();
    const [evolutionNotes, setEvolutionNotes] = useState<any[]>([]);
    const [isLoadingNotes, setIsLoadingNotes] = useState(true);
    const [medicalDocuments, setMedicalDocuments] = useState<any[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [documentNotes, setDocumentNotes] = useState('');

    // Cargar notas de evolución del paciente
    useEffect(() => {
        if (!patient?.id || !supabase) {
            setIsLoadingNotes(false);
            return;
        }

        const fetchNotes = async () => {
            const { data, error } = await supabase
                .from('evolution_notes')
                .select(`
                    *,
                    doctor:users!evolution_notes_doctor_id_fkey(id, display_name)
                `)
                .eq('patient_id', patient.id)
                .order('date', { ascending: false });

            if (error) {
                console.error('Error fetching notes:', error);
            } else {
                // Transformar los datos para incluir doctor_name
                const transformedData = data?.map(note => ({
                    ...note,
                    doctor_name: note.doctor?.display_name || 'Médico no especificado'
                })) || [];
                setEvolutionNotes(transformedData);
            }
            setIsLoadingNotes(false);
        };

        fetchNotes();
    }, [patient?.id, supabase]);

    // Cargar documentos médicos del paciente
    useEffect(() => {
        if (!patient?.id || !supabase) {
            setIsLoadingDocuments(false);
            return;
        }

        const fetchDocuments = async () => {
            const { data, error } = await supabase
                .from('medical_documents')
                .select(`
                    *,
                    uploader:users!medical_documents_uploaded_by_fkey(id, display_name)
                `)
                .eq('patient_id', patient.id)
                .order('uploaded_at', { ascending: false });

            if (error) {
                console.error('Error fetching documents:', error);
            } else {
                const transformedData = data?.map(doc => ({
                    ...doc,
                    uploader_name: doc.uploader?.display_name || 'Usuario no especificado'
                })) || [];
                setMedicalDocuments(transformedData);
            }
            setIsLoadingDocuments(false);
        };

        fetchDocuments();
    }, [patient?.id, supabase]);

    // Ordenar notas por fecha en el cliente (más recientes primero)
    const sortedNotes = evolutionNotes?.slice().sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }) || [];

    // Función para convertir archivo a base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    // Función para obtener tipo de documento según extensión
    const getDocumentType = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const typeMap: { [key: string]: string } = {
            'pdf': 'PDF',
            'jpg': 'Imagen',
            'jpeg': 'Imagen',
            'png': 'Imagen',
            'doc': 'Documento Word',
            'docx': 'Documento Word',
            'xls': 'Excel',
            'xlsx': 'Excel',
            'txt': 'Texto',
        };
        return typeMap[extension || ''] || 'Otro';
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tamaño (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "Archivo muy grande",
                description: "El archivo no debe superar los 10MB.",
            });
            return;
        }

        // Validar tipo de archivo
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 
                             'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                             'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Tipo de archivo no permitido",
                description: "Solo se permiten archivos PDF, imágenes, Word, Excel y texto.",
            });
            return;
        }

        setIsUploadingDocument(true);

        try {
            // Convertir a base64
            const base64String = await convertToBase64(file);

            // Guardar en la base de datos
            const documentData = {
                patient_id: patient.id,
                uploaded_by: user?.id,
                document_name: file.name,
                document_type: getDocumentType(file.name),
                document_url: base64String, // Guardamos el base64 directamente
                file_size: file.size,
                notes: documentNotes.trim() || null,
                uploaded_at: new Date().toISOString(),
            };

            const { error: docError } = await supabase
                .from('medical_documents')
                .insert([documentData]);

            if (docError) throw docError;

            // Crear notificación para el paciente
            const { error: notifError } = await supabase
                .from('notifications')
                .insert([{
                    user_id: patient.id,
                    type: 'document_uploaded',
                    title: 'Nuevo Documento Médico',
                    message: `El Dr. ${user?.display_name} ha subido un nuevo documento: ${file.name}`,
                    read: false,
                    related_id: patient.id,
                    created_at: new Date().toISOString(),
                }]);

            if (notifError) console.error('Error creating notification:', notifError);

            toast({
                title: 'Documento Subido',
                description: 'El documento se ha guardado exitosamente.',
            });

            // Limpiar el campo de notas
            setDocumentNotes('');

            // Recargar documentos
            const { data: docs } = await supabase
                .from('medical_documents')
                .select(`
                    *,
                    uploader:users!medical_documents_uploaded_by_fkey(id, display_name)
                `)
                .eq('patient_id', patient.id)
                .order('uploaded_at', { ascending: false });
            
            const transformedDocs = docs?.map(doc => ({
                ...doc,
                uploader_name: doc.uploader?.display_name || 'Usuario no especificado'
            })) || [];
            setMedicalDocuments(transformedDocs);

            // Resetear el input file
            event.target.value = '';
        } catch (error) {
            console.error('Error uploading document:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo subir el documento. Intenta nuevamente.",
            });
        } finally {
            setIsUploadingDocument(false);
        }
    };

    const handleSaveNote = async () => {
        if (!newNote.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Debes escribir una nota antes de guardar.",
            });
            return;
        }

        if (!patient || !patient.id) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo identificar al paciente.",
            });
            return;
        }

        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Usuario no autenticado.',
            });
            return;
        }

        const noteData = {
            patient_id: patient.id,
            doctor_id: user.id,
            note: newNote.trim(),
            date: new Date().toISOString(),
        };

        try {
            // Guardar la nota de evolución
            const { error: noteError } = await supabase
                .from('evolution_notes')
                .insert([noteData]);
            
            if (noteError) throw noteError;
            
            // Crear notificación para el paciente
            const { error: notifError } = await supabase
                .from('notifications')
                .insert([{
                    user_id: patient.id,
                    type: 'note_added',
                    title: 'Nueva Nota de Evolución',
                    message: `El Dr. ${user.display_name} ha agregado una nueva nota de evolución a tu historial clínico.`,
                    read: false,
                    related_id: patient.id,
                    created_at: new Date().toISOString(),
                }]);
            
            if (notifError) throw notifError;
            
            toast({
                title: 'Nota Guardada',
                description: 'La nota de evolución ha sido registrada exitosamente.',
            });
            setNewNote('');
            
            // Recargar las notas
            if (patient?.id) {
                const { data: notes } = await supabase
                    .from('evolution_notes')
                    .select(`
                        *,
                        doctor:users!evolution_notes_doctor_id_fkey(id, display_name)
                    `)
                    .eq('patient_id', patient.id)
                    .order('date', { ascending: false });
                const transformedNotes = notes?.map(note => ({
                    ...note,
                    doctor_name: note.doctor?.display_name || 'Médico no especificado'
                })) || [];
                setEvolutionNotes(transformedNotes);
            }
        } catch (error) {
            console.error('Error al guardar nota:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo guardar la nota.",
            });
        }
    };

    return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={patient.photo_url} />
                <AvatarFallback>
                {patient.display_name?.charAt(0) || 'P'}
                </AvatarFallback>
            </Avatar>
            <div>
                <DialogTitle className="text-2xl">
                {patient.display_name}
                </DialogTitle>
                <DialogDescription>
                 {patient.email}
                </DialogDescription>
            </div>
        </div>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
        <div>
            <h3 className="text-lg font-semibold mb-2">
                Notas de Evolución
            </h3>
            <div className="space-y-4">
                {isLoadingNotes && [...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg border">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-full mb-1" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                ))}
                {!isLoadingNotes && sortedNotes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                        No hay notas de evolución registradas para este paciente.
                    </p>
                )}
                {sortedNotes.map((note: any) => (
                    <div
                        key={note.id}
                        className="p-3 bg-muted/50 rounded-lg border text-sm"
                    >
                        <p className="font-semibold">{format(new Date(note.date), 'PPP', { locale: es })}</p>
                        <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{note.note}</p>
                        <p className="text-xs text-right text-muted-foreground mt-1">
                        - Dr. {note.doctor_name}
                        </p>
                    </div>
                ))}
            </div>
            <Card className="mt-4">
                <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" /> Agregar Nueva Nota de Evolución
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <Textarea 
                    placeholder="Escribe la nueva nota médica aquí..." 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                />
                <div className="flex justify-end">
                    <Button onClick={handleSaveNote}>Guardar Nota</Button>
                </div>
                </CardContent>
            </Card>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-2">
                Documentos y Estudios Anexos
            </h3>
            
            {/* Formulario para subir documento */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Upload className="h-5 w-5" /> Subir Nuevo Documento
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Notas sobre el documento (opcional)
                        </label>
                        <Textarea
                            placeholder="Ej: Resultados de laboratorio, Radiografía de tórax, etc..."
                            value={documentNotes}
                            onChange={(e) => setDocumentNotes(e.target.value)}
                            rows={2}
                            disabled={isUploadingDocument}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            asChild 
                            variant="default" 
                            disabled={isUploadingDocument}
                            className="w-full"
                        >
                            <label htmlFor="file-upload" className="cursor-pointer">
                                {isUploadingDocument ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Subiendo...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Seleccionar Archivo
                                    </>
                                )}
                                <input 
                                    id="file-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    onChange={handleFileUpload}
                                    disabled={isUploadingDocument}
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
                                />
                            </label>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Formatos permitidos: PDF, imágenes (JPG, PNG), Word, Excel, texto. Máximo 10MB.
                    </p>
                </CardContent>
            </Card>

            {/* Lista de documentos */}
            <div className="space-y-3">
                {isLoadingDocuments && [...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 bg-card rounded-lg border">
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
                {!isLoadingDocuments && medicalDocuments.length > 0 ? (
                    medicalDocuments.map((doc: any) => (
                        <div
                            key={doc.id}
                            className="flex items-start justify-between p-3 bg-card rounded-lg border"
                        >
                            <button
                                onClick={() => openDocument(doc.document_url, doc.document_name)}
                                className="flex items-start gap-3 flex-1 hover:bg-muted/50 transition-colors text-left -m-3 p-3 rounded-l-lg"
                            >
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{doc.document_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Subido el: {format(new Date(doc.uploaded_at), 'PPP', { locale: es })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Por: {doc.uploader_name}
                                    </p>
                                    {doc.document_type && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tipo: {doc.document_type}
                                        </p>
                                    )}
                                    {doc.notes && (
                                        <p className="text-xs text-muted-foreground mt-1 italic">
                                            "{doc.notes}"
                                        </p>
                                    )}
                                </div>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    downloadDocument(doc.document_url, doc.document_name);
                                }}
                                className="p-2 hover:bg-muted/50 rounded transition-colors shrink-0"
                                title="Descargar documento"
                            >
                                <Download className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>
                    ))
                ) : (
                    !isLoadingDocuments && (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted p-6 text-center">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                No hay documentos médicos para este paciente.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Usa el formulario de arriba para subir el primer documento.
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
      </div>
    </DialogContent>
)};



export default function PacientesPage() {
  const { supabase } = useSupabase();
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoadingPatients(false);
      return;
    }

    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'PACIENTE')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
      } else {
        setPatients(data || []);
      }
      setIsLoadingPatients(false);
    };

    fetchPatients();
  }, [supabase]);

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-headline">
            Gestión de Pacientes
          </h1>
          <p className="text-muted-foreground">
            Busca y accede a las historias clínicas de tus pacientes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente por nombre o documento..."
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingPatients && [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-28" />
                        <Skeleton className="h-9 w-36" />
                    </div>
                </div>
            ))}
            {patients?.map((patient: any) => (
              <Dialog key={patient.id}>
                <div
                    className="flex items-center justify-between p-4 rounded-lg border"
                >
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={patient.photo_url} />
                            <AvatarFallback>{patient.display_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{patient.display_name}</p>
                            <p className="text-sm text-muted-foreground">
                            {patient.email}
                            </p>
                        </div>
                    </div>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Historia
                        </Button>
                    </DialogTrigger>
                </div>
                <PatientHistoryDialog patient={patient} />
              </Dialog>
            ))}
             {!isLoadingPatients && patients?.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No se encontraron pacientes</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Aún no hay pacientes registrados en el sistema.
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

